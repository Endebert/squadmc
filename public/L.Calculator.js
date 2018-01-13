L.Calculator = L.LayerGroup.extend({
  options: {
    attribution: 'Created by Robert Ende. Uses modified ' +
    "<a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a> " +
    "and calculation code from <a href='https://squadcalc.com'>squadcalc.com</a>",
    hidden: false,
  },

  initialize(options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
    this.resetVars();
  },

  onAdd(map) {
    this.map = map;
    this.map.on('click', this.onMapClick, this);
    this.map.on('baselayerchange', this.reset, this);

    // this.eachLayer(map.addLayer, map);
  },

  onRemove() {
    this.reset();
  },

  reset() {
    this.eachLayer((layer) => {
      this.removeLayer(layer);
    });
    this.resetVars();
  },

  resetVars() {
    this.angle = 0;
    this.elevation = 0;
    this.mo = {};
    this.dragged = false;
  },

  drawLine() {
    if (!this.mo.mortarMarker || !this.mo.targetMarker) {
      return;
    }

    const s = this.mo.mortarMarker.getLatLng();
    const e = this.mo.targetMarker.getLatLng();

    if (!this.mo.distLine) {
      this.mo.distLine = L.polyline([s, e], {color: 'green'});
      // mapObjects.distLine.addTo(map);
      this.mo.distLine.addTo(this);
    } else {
      this.mo.distLine.setLatLngs([s, e]);
    }

    this.mo.distLine.setStyle({color: isNaN(this.elevation) ? 'red' : 'green'});
  },

  calculate() {
    if (!this.mo.mortarMarker || !this.mo.targetMarker) {
      return;
    }

    const s = this.mo.mortarMarker.getLatLng();
    const e = this.mo.targetMarker.getLatLng();

    this.angle = Math.atan2(e.lng - s.lng, e.lat - s.lat) * 180 / Math.PI;

    const a = s.lat - e.lat;
    const b = s.lng - e.lng;

    const dist = Math.sqrt(a * a + b * b);
    this.angle = Math.round(180 - this.angle); // rotate so 0° is towards North
    this.elevation = Math.round(interpolateElevation(dist));

    const strAngle = (`000${this.angle}`).substr(-3);

    const strElevation = isNaN(this.elevation) ? 'XXXX' : (`0000${this.elevation}`).substr(-4);

    document.getElementById('mapAngle').innerText = `${strAngle}°`;
    document.getElementById('mapBearing').innerText = strElevation;
  },

  setMortar(latlng) {
    console.log('setMortar: ', JSON.stringify(latlng));

    if (!this.mo.mortarMarker) {
      this.mo.mortarMarker = new L.marker(latlng, {draggable: 'true', icon: mortarIcon});
      this.mo.maxRangeCircle = new L.circle(latlng, {
        draggable: 'false',
        radius: 1250,
        color: 'green',
        fillOpacity: 0.05,
      });
      this.mo.minRangeCircle = new L.circle(latlng, {
        draggable: 'false',
        radius: 50,
        color: 'red',
        fillOpacity: 0.05,
      });
      if (this.mo.targetMarker) {
        this.mo.targetMarker.openPopup();
      }
      this.mo.mortarMarker.on('dragstart', (e) => {
        this.dragged = true;
      });
      this.mo.mortarMarker.on('drag', (e) => {
        this.calcAndDraw();
        this.mo.maxRangeCircle.setLatLng(e.latlng);
        this.mo.minRangeCircle.setLatLng(e.latlng);
        document.getElementById('mortarPos').innerText = getKP(e.latlng.lat, e.latlng.lng);
      });
      this.mo.mortarMarker.on('dragend', (e) => {
        setTimeout(() => { // black magic to not trigger click after drag
          // if (this.mo.targetMarker)
          //     this.mo.targetMarker.openPopup();
          this.dragged = false;
        }, 10);
      });
      // map.addLayer(mapObjects.mortarMarker);
      this.mo.mortarMarker.addTo(this);
      this.mo.maxRangeCircle.addTo(this);
      this.mo.minRangeCircle.addTo(this);
    } else {
      this.mo.mortarMarker.setLatLng(latlng);
      this.mo.maxRangeCircle.setLatLng(latlng);
      this.mo.minRangeCircle.setLatLng(latlng);
    }

    this.calcAndDraw();
    document.getElementById('mortarPos').innerText = getKP(latlng.lat, latlng.lng);

    if (this.mo.targetMarker) {
      this.mo.targetMarker.openPopup();
    }
  },

  calcAndDraw() {
    this.calculate();
    this.drawLine();
  },

  setTarget(latlng) {
    console.log('setTarget: ', JSON.stringify(latlng));
    if (!this.mo.targetMarker) {
      this.mo.targetMarker = new L.marker(latlng, {draggable: 'true', icon: targetIcon});

      console.log('opened popup');
      this.mo.targetMarker.on('dragstart', (e) => {
        this.dragged = true;
      });
      this.mo.targetMarker.on('drag', (e) => {
        this.calcAndDraw();
        document.getElementById('targetPos').innerText = getKP(e.latlng.lat, e.latlng.lng);
        // this.mo.targetMarker.openPopup();
      });
      this.mo.targetMarker.on('dragend', (e) => {
        setTimeout(() => { // black magic to not trigger click after drag
          this.dragged = false;
        }, 10);
      });
      // map.addLayer(this.mo.targetMarker);
      this.mo.targetMarker.addTo(this);
    } else {
      this.mo.targetMarker.setLatLng(latlng);
    }
    this.calcAndDraw();
    document.getElementById('targetPos').innerText = getKP(latlng.lat, latlng.lng);
    // this.mo.targetMarker.openPopup();
  },

  onMapClick(e) {
    if (this.dragged) {
      return true;
    } // black magic to not trigger click after drag
    function createButton(label, container) {
      const btn = L.DomUtil.create('button', '', container);
      btn.setAttribute('type', 'button');
      btn.innerHTML = label;
      return btn;
    }

    const choicePopUp = L.popup();
    const container = L.DomUtil.create('div');
    const mortar = createButton(`<img src="./mortar.png" height=${iSize} width=${iSize}>`, container);
    const target = createButton(`<img src="./target.png" height=${iSize} width=${iSize}>`, container);
    console.log("onMapClick this:", this);
    if (!this.mo.mortarMarker) {
      this.setMortar(e.latlng);
    } else if (!this.mo.targetMarker) {
      this.setTarget(e.latlng);
    } else {
      choicePopUp
        .setLatLng(e.latlng)
        .setContent(container)
        .openOn(map);

      L.DomEvent.on(mortar, 'click', () => {
        map.closePopup();
        this.setMortar(e.latlng);
      });

      L.DomEvent.on(target, 'click', () => {
        map.closePopup();
        this.setTarget(e.latlng);
      });
    }

    if (DEBUG) {
      copyTextToClipboard(`[${Math.round(e.latlng.lat)}, ${Math.round(e.latlng.lng)}]`);
    }
  },

});

L.calculator = function (options) {
  return new L.Calculator(options);
};
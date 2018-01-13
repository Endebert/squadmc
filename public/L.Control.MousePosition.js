L.Control.MousePosition = L.Control.extend({
  options: {
    position: 'bottomleft',
    separator: ' : ',
    emptyString: '',
    lngFirst: false,
    numDigits: 5,
    lngFormatter: undefined,
    latFormatter: undefined,
    prefix: '',
  },

  onAdd(map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
    this._onMouseContainer = document.getElementById('mousecoord');
    L.DomEvent.disableClickPropagation(this._container);
    map.on('mousemove', this._onMouseMove, this);
    this._container.innerHTML = this.options.emptyString;
    this._onMouseContainer.innerHTML = this.options.emptyString;
    return this._container;
  },

  onRemove(map) {
    map.off('mousemove', this._onMouseMove);
  },

  _onMouseMove(e) {
    // var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
    // var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
    //
    //
    //
    // var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
    // var prefixAndValue = this.options.prefix + ' ' + value;


    let kp = getKP(e.latlng.lat, e.latlng.lng);

    if (DEBUG) { kp = `${Math.round(e.latlng.lat)} | ${Math.round(e.latlng.lng)}`; }

    this._container.innerHTML = kp;
    this._onMouseContainer.innerHTML = kp;

    this._onMouseContainer.style.left = `${e.originalEvent.pageX + 5}px`;
    this._onMouseContainer.style.top = `${e.originalEvent.pageY + 5}px`;
  },


});

L.Map.mergeOptions({
  positionControl: false,
});

L.Map.addInitHook(function () {
  if (this.options.positionControl) {
    this.positionControl = new L.Control.MousePosition();
    this.addControl(this.positionControl);
  }
});

L.control.mousePosition = function (options) {
  return new L.Control.MousePosition(options);
};

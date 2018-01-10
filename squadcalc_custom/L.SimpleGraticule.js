/**
 *  File: L.SimpleGraticule.js
 *  Desc: A graticule for Leaflet maps in the L.CRS.Simple coordinate system.
 *  Auth: Andrew Blakey (ablakey@gmail.com)
 */
L.SimpleGraticule = L.LayerGroup.extend({
    options: {
        interval: 20,
        showOriginLabel: true,
        redraw: 'move',
        hidden: false,
        zoomIntervals: [],
        attribution: "Created by Robert Ende. Uses modified <a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a> and calculation code from <a href='https://squadcalc.com'>squadcalc.com</a>",
        bounds: L.latLngBounds([[0, 0], [Number.MAX_VALUE, Number.MAX_VALUE]])
    },

    lineStyleKP: {
        stroke: true,
        color: '#000',
        opacity: 1.0,
        weight: 1   ,
        interactive: false,
        clickable: false //legacy support
    },

    lineStyleSUB: {
        stroke: true,
        color: '#000',
        opacity: 0.5,
        weight: 1,
        interactive: false,
        clickable: false //legacy support
    },

    lineStyleSUB2: {
        stroke: true,
        color: '#fff',
        opacity: 0.5,
        weight: 1,
        interactive: false,
        clickable: false //legacy support
    },

    initialize: function (options) {
        L.LayerGroup.prototype.initialize.call(this);
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        this.graticule = this.redraw();

        map.on('viewreset ' + this.options.redraw, this.graticule.redraw, this.graticule);

        this.eachLayer(map.addLayer, map);
    },

    onRemove: function (map) {
        map.off('viewreset ' + this.options.redraw, this.graticule.redraw, this.graticule);
        this.eachLayer(map.removeLayer, map);
    },

    hide: function () {
        this.options.hidden = true;
        this.redraw();
    },

    show: function () {
        this.options.hidden = false;
        this.redraw();
    },

    setBounds: function (bounds) {
        this.options.bounds = bounds;
    },

    redraw2: function () {
        this._bounds = this._map.getBounds();

        this.clearLayers();

        if (!this.options.hidden) {

            const currentZoom = this._map.getZoom();

            for (let i = 0; i < this.options.zoomIntervals.length; i++) {
                if (currentZoom >= this.options.zoomIntervals[i].start && currentZoom <= this.options.zoomIntervals[i].end) {
                    this.options.interval = this.options.zoomIntervals[i].interval;
                    this.constructLines(this.getMins(), this.getLineCounts());

                    if (this.options.showOriginLabel) {
                        this.addLayer(this.addOriginLabel());
                    }
                    break;
                }
            }
        }

        return this;
    },

    redraw: function() {
        console.log("redrawing");
        this._bounds = this._map.getBounds();
        let viewBounds = this.viewBounds();

        this.clearLayers();
        const currentZoom = Math.round(this._map.getZoom());

        console.log("zoom:", this._map.getZoom());

        let kp = 300 / (3**0);
        let s1 = 300 / (3**1);
        let s2 = 300 / (3**2);
        let interval;
        if (currentZoom >= 0)
            interval = s2;
        else if (currentZoom >= -1)
            interval = s1;
        else
            interval = kp;

        // vertical keypad lines
        for (let x = Math.ceil(viewBounds.getWest() / interval) * interval; x <= Math.floor(viewBounds.getEast() / interval) * interval; x+=interval) {
            const bot = new L.LatLng(viewBounds.getSouth(), x);
            const top = new L.LatLng(viewBounds.getNorth(), x);

            // console.log("x %:", [Math.floor(x % kp), Math.floor(x % s1), Math.floor(x % s2)]);
            let curStyle;
            if (this._isMultiple(kp, x))
                curStyle = this.lineStyleKP;
            else if (this._isMultiple(s1, x))
                curStyle = this.lineStyleSUB;
            else if (this._isMultiple(s2, x))
                curStyle = this.lineStyleSUB2;
            else {
                console.log("no match! x = " + x + "; x%:", [x % kp, x % s1, x % s2])
            }
            this.addLayer(new L.Polyline([bot, top], curStyle));
        }

        // horizontal keypad lines
        for (let y = Math.ceil(viewBounds.getSouth() / interval) * interval; y <= Math.floor(viewBounds.getNorth() / interval) * interval; y+=interval) {
            const left = new L.LatLng(y, viewBounds.getWest());
            const right = new L.LatLng(y, viewBounds.getEast());

            let curStyle;
            if (this._isMultiple(kp, y))
                curStyle = this.lineStyleKP;
            else if (this._isMultiple(s1, y))
                curStyle = this.lineStyleSUB;
            else if (this._isMultiple(s2, y))
                curStyle = this.lineStyleSUB2;
            else {
                console.log("no match! y = " + y + "; y%:", [y % kp, y % s1, y % s2])
            }
            this.addLayer(new L.Polyline([left, right], curStyle));
        }



        

        return this;
    },

    _isMultiple: function (x, y) {
        let t = y / x;
        let r = Math.round(t);
        let d = t >= r ? t - r : r - t;
        return d < 0.0001;
    },

    viewBounds: function() {
        let c1 = L.latLng(Math.max(this._bounds.getSouth(), this._map.options.maxBounds ? this._map.options.maxBounds.getSouth() : 0), Math.max(this._bounds.getWest(), this._map.options.maxBounds ? this._map.options.maxBounds.getWest() : 0));
        let c2 = L.latLng(Math.min(this._bounds.getNorth(), this._map.options.maxBounds ? this._map.options.maxBounds.getNorth() : 10000), Math.min(this._bounds.getEast(), this._map.options.maxBounds ? this._map.options.maxBounds.getEast() : 10000));
        return L.latLngBounds(c1, c2);
    },

    getLineCounts: function () {
        return {
            x: Math.ceil((this._bounds.getEast() - this._bounds.getWest()) /
                this.options.interval),
            y: Math.ceil((this._bounds.getNorth() - this._bounds.getSouth()) /
                this.options.interval)
        };
    },

    getMins: function (s) {
        //rounds up to nearest multiple of x
        if (!s)
            s = this.options.interval;
        return {
            x: Math.floor(Math.max(this._bounds.getWest(), this._map.options.maxBounds ? this._map.options.maxBounds.getWest() : 0) / s) * s,
            y: Math.floor(Math.max(this._bounds.getSouth(), this._map.options.maxBounds ? this._map.options.maxBounds.getSouth() : 0) / s) * s
        };
    },

    getMaxs: function (s) {
        if (!s)
            s = this.options.interval;
        return {
            x: Math.ceil(Math.min(this._bounds.getEast(), this._map.options.maxBounds ? this._map.options.maxBounds.getEast() : 10000) / s) * s,
            y: Math.ceil(Math.min(this._bounds.getNorth(), this._map.options.maxBounds? this._map.options.maxBounds.getNorth() : 10000) / s) * s
        };
    },

    constructLines: function (mins, counts) {
        let y;
        let x;
        const xlines = new Array(counts.x);
        const ylines = new Array(counts.y);
        const labels = [];

        //for horizontal lines
        for (let i = 0; i <= counts.x; i++) {
            x = mins.x + i * this.options.interval;
            xlines[i] = this.buildXLine(x);
        }

        //for vertical lines
        for (let j = 0; j <= counts.y; j++) {
            y = mins.y + j * this.options.interval;
            ylines[j] = this.buildYLine(y);
        }

        for (let u = 0; u <= counts.x; u++) {
            for (let v = 0; v <= counts.y; v++) {
                x = mins.x + u * this.options.interval;
                y = mins.y + v * this.options.interval;
                if (0 <= x && 0 <= y && x <= this.options.bounds.getEast() && y <= this.options.bounds.getNorth()) {
                    labels.push(this.buildLabel(y, x));
                }

            }
        }
        xlines.forEach(this.addLayer, this);
        ylines.forEach(this.addLayer, this);
        labels.forEach(this.addLayer, this);
    },

    buildXLine: function (x) {
        const bottomLL = new L.LatLng(this._bounds.getSouth(), x);
        const topLL = new L.LatLng(this._bounds.getNorth(), x);

        return new L.Polyline([bottomLL, topLL], this.lineStyle);
    },

    buildYLine: function (y) {
        const leftLL = new L.LatLng(y, this._bounds.getWest());
        const rightLL = new L.LatLng(y, this._bounds.getEast());

        return new L.Polyline([leftLL, rightLL], this.lineStyle);
    },

    buildLabel: function (xVal, yVal) {
        const latLng = new L.LatLng(xVal, yVal);

        const text = String.fromCharCode(65 + Math.floor(yVal / 300)) + (Math.floor(xVal / 300) + 1);

        // console.log(text + " @ [" + xVal + "," + yVal + "]");

        return L.marker(latLng, {
            interactive: false,
            clickable: false, //legacy support
            icon: L.divIcon({
                iconSize: [0, 0],
                className: 'leaflet-grid-label',
                // html: '<div>' + text + '</div>'
                html: '<div class="gridlabel">' + text + '</div>'
                // html: '<p class="' + axis + '">' + String.fromCharCode(65 + Math.floor(val/300)) + "-" + Math.floor(((val % 300)/(300/3))+1) + "-" + Math.floor(((val % 300)/(300/3/3))+1) + '</div>'
            })
        });
    },

    addOriginLabel: function () {
        return L.marker([0, 0], {
            interactive: false,
            clickable: false, //legacy support
            icon: L.divIcon({
                iconSize: [0, 0],
                className: 'leaflet-grid-label',
                html: '<div class="gridlabel-horiz">(0,0)</div>'
            })
        });
    }
});

L.simpleGraticule = function (options) {
    return new L.SimpleGraticule(options);
};

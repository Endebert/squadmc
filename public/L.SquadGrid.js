/**
 *  File: L.SimpleGraticule.js
 *  Desc: A graticule for Leaflet maps in the L.CRS.Simple coordinate system.
 *  Auth: Andrew Blakey (ablakey@gmail.com)
 */
L.SquadGrid = L.LayerGroup.extend({
    options: {
        redraw: 'move',
        hidden: false,
        attribution: "Created by Robert Ende. Uses modified <a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a> and calculation code from <a href='https://squadcalc.com'>squadcalc.com</a>",
    },

    lineStyleKP: {
        stroke: true,
        color: '#000',
        opacity: 1.0,
        weight: 1,
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
        this.grid = this.redraw();

        map.on('viewreset ' + this.options.redraw, this.grid.redraw, this.grid);

        this.eachLayer(map.addLayer, map);
    },

    onRemove: function (map) {
        map.off('viewreset ' + this.options.redraw, this.grid.redraw, this.grid);
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

    redraw: function () {
        console.log("redrawing");
        this._bounds = this._map.getBounds();
        let viewBounds = this.viewBounds();

        this.clearLayers();
        const currentZoom = Math.round(this._map.getZoom());

        console.log("zoom:", this._map.getZoom());

        let kp = 300 / (3 ** 0);
        let s1 = 300 / (3 ** 1);
        let s2 = 300 / (3 ** 2);
        let interval;
        if (currentZoom >= 0)
            interval = s2;
        else if (currentZoom >= -1)
            interval = s1;
        else
            interval = kp;

        // vertical keypad lines
        for (let x = Math.ceil(viewBounds.getWest() / interval) * interval; x <= Math.floor(viewBounds.getEast() / interval) * interval; x += interval) {
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
        for (let y = Math.ceil(viewBounds.getSouth() / interval) * interval; y <= Math.floor(viewBounds.getNorth() / interval) * interval; y += interval) {
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

    viewBounds: function () {
        let c1 = L.latLng(Math.max(this._bounds.getSouth(), this._map.options.maxBounds ? this._map.options.maxBounds.getSouth() : 0), Math.max(this._bounds.getWest(), this._map.options.maxBounds ? this._map.options.maxBounds.getWest() : 0));
        let c2 = L.latLng(Math.min(this._bounds.getNorth(), this._map.options.maxBounds ? this._map.options.maxBounds.getNorth() : 10000), Math.min(this._bounds.getEast(), this._map.options.maxBounds ? this._map.options.maxBounds.getEast() : 10000));
        return L.latLngBounds(c1, c2);
    },
});

L.squadGrid = function (options) {
    return new L.SquadGrid(options);
};

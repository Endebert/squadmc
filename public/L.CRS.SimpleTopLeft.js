let SimpleTopLeft = extend({}, CRS, {
    projection: LonLat,
    transformation: toTransformation(1, 0, 1, 0),

    scale: function (zoom) {
        return Math.pow(2, zoom);
    },

    zoom: function (scale) {
        return Math.log(scale) / Math.LN2;
    },

    distance: function (latlng1, latlng2) {
        let dx = latlng2.lng - latlng1.lng,
            dy = latlng2.lat - latlng1.lat;

        return Math.sqrt(dx * dx + dy * dy);
    },

    infinite: true
});

L.CRS.SimpleTopLeft = SimpleTopLeft;
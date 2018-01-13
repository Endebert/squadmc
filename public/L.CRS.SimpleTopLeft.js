const SimpleTopLeft = extend({}, CRS, {
  projection: LonLat,
  transformation: toTransformation(1, 0, 1, 0),

  scale(zoom) {
    return zoom ** 2;
  },

  zoom(scale) {
    return Math.log(scale) / Math.LN2;
  },

  distance(latlng1, latlng2) {
    const dx = latlng2.lng - latlng1.lng;
    const dy = latlng2.lat - latlng1.lat;

    return Math.sqrt((dx * dx) + (dy * dy));
  },

  infinite: true,
});

L.CRS.SimpleTopLeft = SimpleTopLeft;

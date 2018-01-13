// FIXME: Custom CRS does not seem to work -> using modified leaflet-src.js for the time being

const Simple = L.extend({}, L.CRS, {
  projection: L.Projection.LonLat,
  transformation: L.transformation(1, 0, 1, 0),

  scale(zoom) {
    return Math.pow(2, zoom);
  },

  zoom(scale) {
    return Math.log(scale) / Math.LN2;
  },

  distance(latlng1, latlng2) {
    let dx = latlng2.lng - latlng1.lng,
      dy = latlng2.lat - latlng1.lat;

    return Math.sqrt(dx * dx + dy * dy);
  },

  infinite: true,
});
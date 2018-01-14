/**
 * This is a very simple extension of L.CRS.Simple. It simply moves point of origin to the top left corner.
 *
 * @type {*|void}
 */
const SimpleTopLeft = L.extend({}, L.CRS.Simple, {
  transformation: L.transformation(1, 0, 1, 0),
});

L.CRS.SimpleTopLeft = SimpleTopLeft;

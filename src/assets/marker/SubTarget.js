import { CircleMarker } from "leaflet";
import MarkerHolder from "./MarkerHolder";

export default class SubTarget extends MarkerHolder {
  constructor(map, pos, draggable, radius = 12, clickHandler = undefined) {
    super(map, pos, draggable);
    this._radius = radius;
    this._clickHandler = clickHandler;
  }

  _createMarker() {
    this.marker =
      new CircleMarker(this._pos, { radius: this._radius, draggable: this._draggable, bubblingMouseEvents: false });
    if (this._clickHandler) {
      this.marker.on("click", this._clickHandler);
    }
  }

  get radius() {
    return this.marker.options.radius;
  }

  set radius(r) {
    this.marker.options.radius = r;
  }
}

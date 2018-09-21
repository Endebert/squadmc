import { Circle } from "leaflet";

import PinHolder from "./PinHolder";
import { FOB_DISTANCE, FOB_RANGE } from "../../Vars";


export default class FobPin extends PinHolder {
  _createAttachments() {
    super._createAttachments();
    const buildAreaCircle = new Circle(this.pos, {
      draggable: "false",
      radius: FOB_RANGE, // build range
      color: this.color,
      fillOpacity: 0,
      dashArray: "10, 10",
      interactive: false,
      clickable: false, // legacy support
    });

    const fobDistanceCircle = new Circle(this.pos, {
      draggable: "false",
      radius: FOB_DISTANCE, // min distance to next fob
      color: this.color,
      fillOpacity: 0,
      dashArray: "10, 10",
      interactive: false,
      clickable: false, // legacy support
    });

    this._attachments = [buildAreaCircle, fobDistanceCircle];
  }
}

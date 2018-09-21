import { Icon, Marker } from "leaflet";

import { getKP, pinToColor, pinToSymbol } from "../../Utils";
import { ICON_SIZE } from "../../Vars";
import MarkerHolder from "../MarkerHolder";

/**
 * This Class holds a pin of a certain type. It behaves similar to a leaflet Marker with setLatLng() and getLatLng(),
 * however, it provides additional functionality, such as binding and moving tooltips and min/max range circles
 */
export default class PinHolder extends MarkerHolder {
  constructor(map, pos, icon, draggable = true) {
    super(map, pos, draggable);
    this._icon = icon;
    this.pinUrl = icon.options.iconUrl;
    this.symbolUrl = pinToSymbol(this.pinUrl);
    this.color = pinToColor(this.pinUrl);
  }

  _createMarker() {
    this.marker = new Marker(this._pos, { draggable: this._draggable, icon: this._icon });
  }

  get size() {
    return this.marker.options.icon.options.iconSize[0];
  }

  set size(size) {
    console.log("size:", size);
    this.marker.setIcon(PinHolder.createIcon(this._icon.options.iconUrl, size));
  }

  static createIcon(pinUrl, size) {
    return new Icon({
      iconUrl: pinUrl,
      iconSize: [size, size],
      iconAnchor: [size / 2, (4 * size / ICON_SIZE)],
      // point from which the popup should open relative to the iconAnchor
      popupAnchor: [0, -ICON_SIZE / 2],
    });
  }

  // get pinUrl() {
  //   console.log("symbolUrl");
  //   return this.marker.options.icon.options.iconUrl;
  // }
  //
  // get symbolUrl() {
  //   console.log("symbolUrl");
  //   return pinToSymbol(this.pinUrl);
  // }


  _onDragStart() {
    super._onDragStart();
    this.marker.bindTooltip(
      "",
      { permanent: true, direction: "top", offset: [0, -(4 * this.size / ICON_SIZE)] },
    );
  }


  _onDrag(e) {
    super._onDrag(e);
    this.marker.setTooltipContent(getKP(e.latlng.lat, e.latlng.lng));
  }

  _onDragEnd() {
    super._onDragEnd();
    this.marker.unbindTooltip();
  }
}

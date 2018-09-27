import { LatLng } from "leaflet";

import { getDist } from "./Utils";
import SubTarget from "./marker/SubTarget";
import { MAX_SUBTARGETS_COUNT } from "./Vars";

export default class SubtargetsHolder {
  constructor(map) {
    /**
     * @type {SubTarget[]}
     */
    this.targets = [];
    this._map = map;
    this._onTargetClickListeners = [];
  }

  /**
   *
   * @param {LatLng} s
   * @param {LatLng} e
   * @param {number} spacing
   */
  genLineFire(s, e, spacing) {
    console.log("genLineFire:", [s.toString(), e.toString(), spacing]);
    this.hideAll();
    const dist = getDist(s, e);
    const latDist = e.lat - s.lat;
    const lngDist = e.lng - s.lng;

    const intervals = Math.ceil(dist / spacing);
    const step = 1 / intervals;
    console.debug(`actual spacing: ${dist * step}`);

    const targets = [];
    for (let i = 0; i <= intervals; i++) {
      const offsetFactor = i * step;
      const t = new SubTarget(
        this._map,
        new LatLng(s.lat + latDist * offsetFactor, s.lng + lngDist * offsetFactor),
        false,
        undefined,
        () => { this._onTargetClick(i); },
      );
      targets[i] = t;
    }

    this.targets = targets;
    return this.targets;
  }

  genAreaFire(s, e, spacing) {
    console.log("genAreaFire:", [s, e, spacing]);
    this.hideAll();
    const ul = new LatLng(Math.min(s.lat, e.lat), Math.min(s.lng, e.lng));
    const dr = new LatLng(Math.max(s.lat, e.lat), Math.max(s.lng, e.lng));

    const latDist = dr.lat - ul.lat;
    const lngDist = dr.lng - ul.lng;

    const latIntervals = Math.ceil(latDist / spacing);
    const latStep = 1 / latIntervals;

    const lngIntervals = Math.ceil(lngDist / spacing);
    const lngStep = 1 / lngIntervals;

    console.debug(`drawing [${latIntervals}][${lngIntervals}] from ${ul.toString()} to ${dr.toString()}`);
    console.debug(`dist: [${latDist}][${lngDist}]`);
    console.debug(`steps: [${latStep}][${lngStep}]`);
    console.debug(`actual spacing: [${latDist * latStep}, ${lngDist * lngStep}]`);
    const targets = [];
    let maxReached = false;
    for (let latI = 0; latI <= latIntervals; latI++) {
      if (maxReached) {
        break;
      }

      const fLatOffset = latI * latStep;
      for (let lngI = 0; lngI <= lngIntervals; lngI++) {
        if (maxReached) {
          break;
        }

        const i = ((lngIntervals + 1) * latI) + lngI;
        const fLngOffset = lngI * lngStep;
        console.debug(`offsets: [${fLatOffset}, ${fLngOffset}]`);
        targets[i] = new SubTarget(
          this._map,
          new LatLng(
            ul.lat + latDist * fLatOffset,
            ul.lng + lngDist * fLngOffset,
          ),
          false,
          undefined,
          () => {
            this._onTargetClick(i);
          },
        );
        console.debug(`[${latI}, ${lngI}] -> ${i} = [${targets[i].pos.lat}, ${targets[i].pos.lng}]`);
        if (i === MAX_SUBTARGETS_COUNT) {
          maxReached = true;
        }
      }
    }
    this.targets = targets;
    return this.targets;
  }

  addOnTargetClickListener(l) {
    this._onTargetClickListeners.push(l);
  }

  _onTargetClick(i) {
    console.log("_onTargetClick:", i);
    this._onTargetClickListeners.forEach((l) => {
      l(i);
    });
  }

  showAll() {
    console.log("showAll:", this.targets.length);
    this.targets.forEach((t) => {
      t.show();
    });
  }

  hideAll() {
    this.targets.forEach((t) => {
      t.hide();
    });
  }
}

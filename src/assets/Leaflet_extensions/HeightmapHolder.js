/**
 * This class loads/holds a heightmap and its relevant settings, in order to get the height for a latlng coordinate
 */
export default class HeightmapHolder {
  constructor() {
    this.c = document.getElementById("heightmap") || document.createElement("canvas");
    this.ctx = this.c.getContext("2d");
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.hasHeightmap = false;
    this.scale = 1;
  }

  /**
   * prepares heightmap given by url using given z-scaling
   * @param url - URL to heightmap
   * @param scale - z-scaling of heightmap
   */
  setMap(url, scale) {
    console.log("setMap:", [url, scale]);
    this.scale = scale;
    this.img.onload = () => {
      // set new height
      this.c.width = this.img.width;
      this.c.height = this.img.height;

      // clear & draw
      this.ctx.clearRect(0, 0, this.c.width, this.c.height);
      this.ctx.drawImage(this.img, 0, 0);
      this.hasHeightmap = true;
      this.getHeight(0, 0); // dirty hack: calling getHeight once, because first call takes long on Chrome
    };
    this.img.src = url; // this initiates downloading the image
  }

  /**
   * Toggles indicator for having heightmap. Actual clearing happens when loading new heightmap in setMap()
   */
  clearHeightmap() {
    this.hasHeightmap = false;
  }

  /**
   * Get the height value in meters (relative) for the current latlng position
   * (which in this case is also pixel coordinates of heightmap)
   * @param {Number} x - lat position
   * @param {Number} y - lng position
   * @returns {number} - relative height in meters
   */
  getHeight(x, y) {
    console.log("getHeight:", [x, y]);
    if (this.hasHeightmap) {
      const rx = Math.round(x);
      const ry = Math.round(y);
      const w = this.c.width;
      const h = this.c.height;
      console.log(`is (${rx}, ${ry}) in [${w}, ${h}]? ${rx >= 0 && rx < w && ry >= 0 && ry < h}`);
      if (rx >= 0 && rx < w && ry >= 0 && ry < h) { // return data if point is on heightmap
        // heightmaps are optimized and use both blue and red color channels to represent height
        // color curve is blue<->black<->red
        // let's say heightmap is 0-512, then blue represents 0-256 and red represents 257-512
        const d = this.ctx.getImageData(rx, ry, 1, 1).data;
        console.log("getHeight imageData:", d);
        return (255 - d[2] + d[0]) * this.scale;
      }
      console.log("getHeight: out of bounds");
      // return Number.NaN; // return NaN when out of bounds
    }
    console.log("getHeight: no heightmap, returning 0");
    return 0; // let's ignore height if there is no heightmap, or heightmap is not ready yet
  }
}

export default class MortarType {
  /**
   * Initializes MortarType with the name of the mortar, its shell velocity, and its max distance.
   * @param {string} name
   * @param {number} velocity
   * @param {number} maxDistance
   */
  constructor(name, velocity, maxDistance) {
    this.name = name;
    this.velocity = velocity;
    this.maxDistance = maxDistance;
  }
}

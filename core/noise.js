import { modMod } from "./util.js";

/**
 * Represents a generator for simplex noise.
 */
export class Noise {
    /**
     * Create a simplex noise generator object.
     * @param {number} scale The scale of the noise.
     * @param {number} magnitude The magnitude of the noise.
     */
    constructor(scale, magnitude) {
        /**
         * The scale of the noise on the x and z axes.
         * @type {number}
         */
        this.scale = scale;
        /**
         * The magnitude of the noise on the y axis.
         * @type {number}
         */
        this.magnitude = magnitude;
        /**
         * An object of all pregenerated random values.
         * @type {{[x: string]: number}}
         * @private
         */
        this.pregeneratedRandomValues = {};
    }

    /**
     * A helper that gets the random value at a position.
     * @param {string} x The seed.
     * @returns {number} The raw value from zero to one.
     * @private
     */
    getRandomAt(x) {
        if (this.pregeneratedRandomValues[x] == undefined)
        this.pregeneratedRandomValues[x] = Math.random();
        return this.pregeneratedRandomValues[x];
    }

    /**
     * A helper that calculates at a position without scale or magnitude.
     * @param {number} x The x position.
     * @param {number} z The z position.
     * @returns {number} The raw value from zero to one.
     * @private
     */
    unmappedCalculate(x, z) {
        let n = x;
        let k = z;
        while (n < 0) n += 10000;
        while (k < 0) k += 10000;
        let a = modMod(n, 1);
        let b = modMod(k, 1);
        let a1 = this.getRandomAt(`x ${Math.floor(x)}`);
        let b1 = this.getRandomAt(`z ${Math.floor(z)}`);
        let a2 = this.getRandomAt(`x ${Math.floor(x+1)}`);
        let b2 = this.getRandomAt(`z ${Math.floor(z+1)}`);
        return ((
            a1 + a * (a2 - a1)
        ) + (
            b1 + b * (b2 - b1)
        )) / 2;
    }

    /**
     * Calculate the noise at a position.
     * @param {number} x The x position.
     * @param {number} z The z position.
     * @returns {number} The value between zero and the magnitude.
     */
    calculate(x, z) {
        return this.unmappedCalculate(x / this.scale, z / this.scale) * this.magnitude;
    }
}
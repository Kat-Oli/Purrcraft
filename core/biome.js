import { Noise } from "./noise.js";
import { Block } from "./block.js";

/**
 * Represents a biome.
 */
export class Biome {
    /**
     * Create a biome definition.
     * @param {Noise[]} heightMapNoises An array of noises used in the height map.
     * @param {(depth: number)=>Block} groundFunc The function that generates underground blocks, using a depth.
     */
    constructor(heightMapNoises, groundFunc) {
        /**
         * An array of noises used in the height map.
         * @type {Noise[]}
         * @readonly
         */
        this.heightMapNoises = heightMapNoises;
        /**
         * The function that generates blocks underground.
         * @param {(depth: number)=>Block}
         * @function
         * @readonly
         */
        this.groundFunc = groundFunc;
    }

    /**
     * Calculate the height at a position.
     * @param {number} x The block x.
     * @param {number} z The block z.
     * @returns {number} The height.
     */
    getHeight(x, z) {
        /**
         * The result of the height map calculations put together.
         * @type {number}
         */
        let result = 0;
        this.heightMapNoises.forEach(n=>result+=n.calculate(x, z));
        return result;
    }
}
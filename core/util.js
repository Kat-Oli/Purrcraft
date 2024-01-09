import { DirtBlock, GrassBlock, StoneBlock } from "../block/nature.js";
import { Block } from "./block.js";
import { Texture, TextureLoader } from "./lib/three.mjs"

const textureLoader = new TextureLoader();

/**
 * Loads a texture asset.
 * @param {string} uri The URI or URL of the texture.
 * @returns {Texture}
 */
export function loadTexture(uri) {
    return textureLoader.load(uri);
}

/**
 * A modified version of the modulo function that accepts negative numbers.
 * @param {number} a The first value.
 * @param {number} b The second value.
 * @returns {number} The result of the new function.
 */
export function modMod(a, b) {
    if (a >= 0) return a % b;
    else return b - (Math.abs(a) % b);
}

/**
 * The default underground block generator function.
 * @param {number} depth The number of blocks underground, rounded down.
 * @returns {Block} The generated block.
 */
export function defaultUndergroundBlockGenerator(depth) {
    if (depth < 1)
        return new GrassBlock();
    else if (depth < 4)
        return new DirtBlock();
    else
        return new StoneBlock();
}
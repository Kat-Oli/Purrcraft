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
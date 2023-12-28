import { Chunk } from "./chunk.js"
import { Scene } from "./lib/three.mjs";

/**
 * Represents the game world.
 */
export class World {
    /**
     * Create the world instance.
     * @param {Scene} scene The threejs scene.
     */
    constructor(scene) {
        /**
         * An array of all chunks in the world.
         * @type {Chunk[]}
         */
        this.chunks = [];
        /**
         * The threejs scene to add everything to.
         * @type {Scene}
         */
        this.scene = scene;
    }

    /**
     * Add a chunk to the world.
     * @param {Chunk} chunk The chunk to add.
     */
    addChunk(chunk) {
        this.scene.add(chunk.mesh);
        chunk.buildBlockData();
        chunk.buildGeometry();
        this.chunks.push(chunk);
    }
}
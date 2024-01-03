import { Chunk } from "./chunk.js"
import { PerspectiveCamera, Scene } from "./lib/three.mjs";

/**
 * Represents the game world.
 */
export class World {
    /**
     * Create the world instance.
     * @param {Scene} scene The threejs scene.
     * @param {number} renderDistance The render distance.
     */
    constructor(scene, renderDistance) {
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
        /**
         * The render distance.
         * @type {number}
         */
        this.renderDistance = renderDistance;
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

    /**
     * Tick the world.
     * @param {PerspectiveCamera} camera The camera.
     */
    tick(camera) {
        /**
         * The x position of the chunk.
         * @param {number}
         */
        const chunkX = Math.floor(camera.position.x / Chunk.size);
        /**
         * The y position of the chunk.
         * @param {number}
         */
        const chunkY = Math.floor(camera.position.y / Chunk.size);
        /**
         * The z position of the chunk.
         * @param {number}
         */
        const chunkZ = Math.floor(camera.position.z / Chunk.size);
        /**
         * The number of remaining chunk generations.
         * @type {number}
         */
        let remaining = 3;
        for (let offsetX = -this.renderDistance; offsetX < this.renderDistance; offsetX++) {
            for (let offsetY = -this.renderDistance; offsetY < this.renderDistance; offsetY++) {
                for (let offsetZ = -this.renderDistance; offsetZ < this.renderDistance; offsetZ++) {
                    if ((this.getChunkAt(
                        chunkX + offsetX,
                        chunkY + offsetY,
                        chunkZ + offsetZ
                    ) == undefined) && (
                        remaining > 0
                    )) {
                        this.addChunk(new Chunk(
                            chunkX + offsetX,
                            chunkY + offsetY,
                            chunkZ + offsetZ
                        ));
                        remaining--;
                    }
                }
            }
        }
    }

    /**
     * Get the chunk at any position.
     * @param {number} x The x position of the chunk.
     * @param {number} y The y position of the chunk.
     * @param {number} z The z position of the chunk.
     */
    getChunkAt(x, y, z) {
        for (let index = 0; index < this.chunks.length; index++) {
            if (this.chunks[index].x == x)
            if (this.chunks[index].y == y)
            if (this.chunks[index].z == z) {
                return this.chunks[index];
            }
        }
        return null;
    }
}
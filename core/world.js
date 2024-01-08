import { Chunk } from "./chunk.js";
import { AirBlock } from "../block/nature.js";
import { PerspectiveCamera, Scene } from "./lib/three.mjs";
import { Terrain } from "./terrain.js";
import { Block } from "./block.js";
import { modMod } from "./util.js";
import { Player } from "./player.js";

/**
 * Represents the game world.
 */
export class World {
    /**
     * Create the world instance.
     * @param {Scene} scene The threejs scene.
     * @param {number} renderDistance The render distance.
     * @param {Terrain} terrain The terrain to use.
     */
    constructor(scene, renderDistance, terrain) {
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
        /**
         * The terrain to use.
         * @type {Terrain}
         */
        this.terrain = terrain;
        /**
         * The player.
         * @type {Player}
         */
        this.player = new Player();
        /**
         * The old time (previous frame.)
         * @type {number}
         */
        this.oldTime = Date.now();
    }

    /**
     * Add a chunk to the world.
     * @param {Chunk} chunk The chunk to add.
     */
    addChunk(chunk) {
        this.scene.add(chunk.mesh);
        chunk.buildBlockData(this.terrain);
        chunk.buildGeometry();
        this.chunks.push(chunk);
    }

    /**
     * Tick the world.
     * @param {PerspectiveCamera} camera The camera.
     */
    tick(camera) {
        this.player.tick(this, camera, (Date.now() - this.oldTime) / 1000)
        this.oldTime = Date.now();
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

    /**
     * Return the block at any position.
     * If no block is found, returns AirBlock.
     * @param {number} x The x position in blocks.
     * @param {number} y The y position in blocks.
     * @param {number} z The z position in blocks.
     * @returns {Block} The block or air.
     */
    getBlockAt(x, y, z) {
        /**
         * The chunk at the position.
         * @type {Chunk}
         */
        let ch = this.getChunkAt(
            Math.floor(x / Chunk.size),
            Math.floor(y / Chunk.size),
            Math.floor(z / Chunk.size)
        );
        if (ch != undefined) return ch.blockData[
            (modMod(x, Chunk.size)) +
            (modMod(y, Chunk.size) * Chunk.size) +
            (modMod(z, Chunk.size) * Chunk.area)
        ] || new AirBlock();
        else return new AirBlock();
    }
}
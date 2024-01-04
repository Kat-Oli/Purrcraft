import { Noise } from "./noise.js";
import { Chunk } from "./chunk.js";
import { Block } from "./block.js";
import { AirBlock, DirtBlock, GrassBlock, StoneBlock } from "../block/nature.js";

/**
 * Represents a terrain definition.
 */
export class Terrain {
    /**
     * Creates a terrain definition.
     * @param {Noise[]} height The height noises.
     */
    constructor(height) {
        /**
         * The height noises.
         * @type {Noise[]}
         */
        this.height = height;
    }

    /**
     * Generate the block data for a chunk.
     * @param {Chunk} chunk 
     */
    generateChunkData(chunk) {
        /**
         * The x offset in blocks.
         * @type {number}
         */
        const xOffset = chunk.x * Chunk.size;
        /**
         * The y offset in blocks.
         * @type {number}
         */
        const yOffset = chunk.y * Chunk.size;
        /**
         * The z offset in blocks.
         * @type {number}
         */
        const zOffset = chunk.y * Chunk.size;
        /**
         * The height relative to the chunk in blocks.
         * @type {number}
         */
        let heightOffset;
        /**
         * The result block.
         * @type {Block}
         */
        let resultBlock;
        /**
         * Every result block.
         * @type {Block[]}
         */
        let result = new Array(Chunk.volume);
        /**
         * The current block index.
         * @type {number}
         */
        let index;
        for (let x = 0; x < Chunk.size; x++)
        for (let z = 0; z < Chunk.size; z++) {
            heightOffset = -yOffset;
            this.height.forEach(noise=>{
                heightOffset += noise.calculate(x+xOffset, z+zOffset);
            });
            for (let y = 0; y < Chunk.size; y++) {
                resultBlock = new AirBlock();
                if (y < heightOffset) {
                    if (y > heightOffset - 1) resultBlock =  new GrassBlock();
                    else if (y > heightOffset - 4) resultBlock = new DirtBlock();
                    else resultBlock = new StoneBlock();
                }
                index = x + y * Chunk.size + z * Chunk.area;
                result[index] = resultBlock;
            }
        }
        return result;
    }
}
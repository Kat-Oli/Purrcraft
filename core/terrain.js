import { AirBlock } from "../block/nature.js";
import { Biome } from "./biome.js";
import { Chunk } from "./chunk.js";

/**
 * Represents a terrain definition.
 */
export class Terrain {
    /**
     * Creates a terrain definition.
     * @param {Biome[]} biomes An array of biomes that can generate in the world.
     * @param {number} biomeMapScale The scale of the biome map.
     */
    constructor(biomes, biomeMapScale) { 
        /**
         * An array of each possible biome that can generate in the world.
         * @type {Biome[]}
         */
        this.biomes = biomes;
        /**
         * The biome map scale.
         * @param {number}
         */
        this.biomeMapScale = biomeMapScale;
        /**
         * An object of all pregenerated random chunk values.
         * @type {{[x: string]: number}}
         * @private
         */
        this.pregeneratedRandomChunkValues = {};
    }

    /**
     * Generate the block data for a chunk.
     * @param {Chunk} chunk The chunk to generate.
     */
    generateChunkData(chunk) {
        /**
         * The biome to fill the chunk with.
         * @type {Biome}
         */
        const biome = this.getBiomeAt(chunk.x / this.biomeMapScale, chunk.z / this.biomeMapScale);
        /**
         * The height of the surface relative to the bottom of the chunk, measured in blocks.
         * @type {number}
         */
        let height;
        /**
         * The index of the block being generated.
         * @type {number}
         */
        let index;
        for (let x = 0; x < Chunk.size; x++)
            for (let z = 0; z < Chunk.size; z++) {
                height = biome.getHeight(x + chunk.x * Chunk.size, z + chunk.z * Chunk.size) - chunk.y * Chunk.size;
                for (let y = 0; y < Chunk.size; y++) {
                    index = x + y * Chunk.size + z * Chunk.area;
                    if (height < y) chunk.blockData[index] = new AirBlock();
                    else chunk.blockData[index] = biome.groundFunc(-(y - height));
                }
            }
        ;
    }

    /**
     * Get the biome at a position.
     * @param {number} groupX The x position of the chunk in chunks.
     * @param {number} groupY The z position of the chunk in chunks.
     * @returns {Biome} The biome.
     */
    getBiomeAt(groupX, groupY) {
        return this.getBiomeWithoutRoundingDownAt(Math.floor(groupX), Math.floor(groupY));
    }

    /**
     * Get the biome at a position without rounding down.
     * @param {number} groupX The x position of the chunk in chunks.
     * @param {number} groupY The z position of the chunk in chunks.
     * @returns {Biome} The biome.
     * @private
     */
    getBiomeWithoutRoundingDownAt(groupX, groupY) {
        return this.biomes[Math.floor(this.getBiomeRandomNumberHelperAt(groupX, groupY) * this.biomes.length)];
    }

    /**
     * Get the random number at a position used to get biomes.
     * Does not round down!
     * @param {number} groupX The x position of the chunk in chunks.
     * @param {number} groupY The z position of the chunk in chunks.
     * @returns {number} The random number.
     * @private
     */
    getBiomeRandomNumberHelperAt(groupX, groupY) {
        if (this.pregeneratedRandomChunkValues[this.nameKeyOfBiomeRandomNumberHelperValue(groupX, groupY)]==undefined)
            this.pregeneratedRandomChunkValues[this.nameKeyOfBiomeRandomNumberHelperValue(groupX, groupY)]=Math.random();
        return this.pregeneratedRandomChunkValues[this.nameKeyOfBiomeRandomNumberHelperValue(groupX, groupY)];
    }

    /**
     * Name the key of the pregenerated random value for a chunk.
     * Does not round down!
     * @param {number} groupX The x position of the chunk in chunks.
     * @param {number} groupY The z position of the chunk in chunks.
     * @returns {number} The random number.
     * @private
     */
    nameKeyOfBiomeRandomNumberHelperValue(groupX, groupY) {
        return `(${groupX}, ${groupY})`;
    }
}
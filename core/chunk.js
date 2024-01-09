import { AirBlock, GrassBlock, StoneBlock } from "../block/nature.js";
import { Block } from "./block.js";
import { BufferAttribute, BufferGeometry, DoubleSide, Material, Mesh, MeshBasicMaterial, NearestFilter, Texture } from "./lib/three.mjs";
import { Terrain } from "./terrain.js";
import { loadTexture } from "./util.js";

/**
 * @typedef {{position:number[], uv:number[]}} BlockFaceGeometryData
 */

/**
 * Represents a group of blocks with a constant and global size.
 */
export class Chunk {
    /**
     * The size of each chunk.
     * @type {number}
     * @readonly
     */
    static size = 24;

    /**
     * The area of a chunk face.
     * @type {number}
     * @readonly
     */
    static area = this.size**2;

    /**
     * The number of blocks per chunk.
     * @type {number}
     * @readonly
     */
    static volume = this.size**3;

    /**
     * The threejs texture on each chunk.
     * @type {Texture}
     * @readonly
     */
    static texture = loadTexture("./assets/chunk.png");

    /**
     * The texture atlas.
     * @type {number}
     * @readonly
     */
    static atlasSize = 5;

    /**
     * The material applied to all chunks.
     * @type {Material}
     * @readonly
     */
    static material = new MeshBasicMaterial({map:this.texture,side:DoubleSide});

    /**
     * Create a chunk at a position. 
     * @param {number} x The x position.
     * @param {number} y The y position.
     * @param {number} z The z position.
     */
    constructor(x, y, z) {
        /**
         * The x position of the chunk.
         * @type {number}
         * @readonly
         */
        this.x = x;
        /**
         * The y position of the chunk.
         * @type {number}
         * @readonly
         */
        this.y = y;
        /**
         * The z position of the chunk.
         * @type {number}
         * @readonly
         */
        this.z = z;
        /**
         * The threejs mesh used to render the chunk.
         * @type {Mesh}
         */
        this.mesh = new Mesh(
            new BufferGeometry(),
            Chunk.material
        );
        this.mesh.position.set(x * Chunk.size, y * Chunk.size, z * Chunk.size);
        /**
         * The block data, an array of all blocks.
         * For now they will be booleans but that will change.
         * @type {Block[]}
         */
        this.blockData = new Array(Chunk.volume);
        this.blockData.fill(new AirBlock());

        Chunk.texture.magFilter = NearestFilter;
        Chunk.texture.minFilter = NearestFilter;
    }

    /**
     * Generates the block data for the chunk.
     * @param {Terrain} terrain The terrain to use.
     */
    buildBlockData(terrain) {
        terrain.generateChunkData(this);
    }

    /**
     * Generates the mesh geometry for the chunk using the block data.
     */
    buildGeometry() {
        if (this.mesh.parent == null)
            console.warn("A chunk's mesh is not attached to the scene!");
        /**
         * An array of block face data to add to the geometry.
         * @type {BlockFaceGeometryData[]}
         */
        let results = [];
        /**
         * The x position of the first block.
         * @type {number}
         */
        let firstX;
        /**
         * The y position of the first block.
         * @type {number}
         */
        let firstY;
        /**
         * The z position of the first block.
         * @type {number}
         */
        let firstZ;
        /**
         * The first block.
         * @type {Block}
         */
        let firstBlock;
        for (firstX = 0; firstX < Chunk.size; firstX++)
        for (firstY = 0; firstY < Chunk.size; firstY++)
        for (firstZ = 0; firstZ < Chunk.size; firstZ++) {
            firstBlock = this.blockData[firstX + firstY * Chunk.size + firstZ * Chunk.area];
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX, firstY + 1, firstZ,
                {
                    position: [
                        firstX, firstY + 1, firstZ,
                        firstX + 1, firstY + 1, firstZ,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX, firstY + 1, firstZ + 1,
                        firstX, firstY + 1, firstZ
                    ],
                    uv: Chunk.generateBlockFaceUvYP(firstBlock.textures[0])
                }
            ));
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX, firstY - 1, firstZ,
                {
                    position: [
                        firstX, firstY, firstZ,
                        firstX + 1, firstY, firstZ,
                        firstX + 1, firstY, firstZ + 1,
                        firstX + 1, firstY, firstZ + 1,
                        firstX, firstY, firstZ + 1,
                        firstX, firstY, firstZ
                    ],
                    uv: Chunk.generateBlockFaceUvYM(firstBlock.textures[2])
                }
            ));
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX + 1, firstY, firstZ,
                {
                    position: [
                        firstX + 1, firstY, firstZ,
                        firstX + 1, firstY + 1, firstZ,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX + 1, firstY, firstZ + 1,
                        firstX + 1, firstY, firstZ
                    ],
                    uv: Chunk.generateBlockFaceUvXP(firstBlock.textures[1])
                }
            ));
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX - 1, firstY, firstZ,
                {
                    position: [
                        firstX, firstY, firstZ,
                        firstX, firstY + 1, firstZ,
                        firstX, firstY + 1, firstZ + 1,
                        firstX, firstY + 1, firstZ + 1,
                        firstX, firstY, firstZ + 1,
                        firstX, firstY, firstZ
                    ],
                    uv: Chunk.generateBlockFaceUvXM(firstBlock.textures[1])
                }
            ));
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX, firstY, firstZ + 1,
                {
                    position: [
                        firstX, firstY, firstZ + 1,
                        firstX, firstY + 1, firstZ + 1,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX + 1, firstY + 1, firstZ + 1,
                        firstX + 1, firstY, firstZ + 1,
                        firstX, firstY, firstZ + 1
                    ],
                    uv: Chunk.generateBlockFaceUvZP(firstBlock.textures[1])
                }
            ));
            results.push(this.generateBlockFaceGeometryIfNeeded(
                firstX, firstY, firstZ,
                firstX, firstY, firstZ - 1,
                {
                    position: [
                        firstX, firstY, firstZ,
                        firstX, firstY + 1, firstZ,
                        firstX + 1, firstY + 1, firstZ,
                        firstX + 1, firstY + 1, firstZ,
                        firstX + 1, firstY, firstZ,
                        firstX, firstY, firstZ
                    ],
                    uv: Chunk.generateBlockFaceUvZM(firstBlock.textures[1])
                }
            ));
        }
        /**
         * The results unpacked into one block face data.
         * @type {BlockFaceGeometryData}
         */
        let unpackedResults = {
            position: [],
            uv: []
        };
        results.forEach(item=>{
            unpackedResults.position.push(...item.position)
            unpackedResults.uv.push(...item.uv);
        });
        this.setGeometryBufferAttribute("position", unpackedResults.position, 3);
        this.setGeometryBufferAttribute("uv", unpackedResults.uv, 2)
    }

    /**
     * Checks if a block face is needed between two blocks.
     * @param {number} firstIndex The index of the first block.
     * @param {number} secondIndex The index of the second block.
     * @returns {boolean} If the block face is needed.
     */
    needsBlockFace(firstIndex, secondIndex) {
        return (!this.blockData[firstIndex].isInvisible) && this.blockData[secondIndex].isInvisible;
    }

    /**
     * Checks if a block face is needed between the block and a chunk edge.
     * @param {number} firstIndex The index of the block.
     * @returns {boolean} If the block face is needed.
     */
    needsBlockFaceAlt(firstIndex) {
        return !this.blockData[firstIndex].isInvisible;
    }

    /**
     * Returns the block face geometry as needed, returns an empty one if it is unnecessary.
     * @param {number} firstX The x position of the first block.
     * @param {number} firstY The y position of the first block.
     * @param {number} firstZ The z position of the first block.
     * @param {number} secondX The x position of the second block.
     * @param {number} secondY The y position of the second block.
     * @param {number} secondZ The z position of the second block.
     * @param {BlockFaceGeometryData} faceData The block face data to add if it is needed.
     */
    generateBlockFaceGeometryIfNeeded(firstX, firstY, firstZ, secondX, secondY, secondZ, faceData) {
        /**
         * The index of the first block.
         * @type {number}
         */
        const firstIndex = firstX + firstY * Chunk.size + firstZ * Chunk.area;
        /**
         * The index of the second block.
         * @type {number}
         */
        const secondIndex = secondX + secondY * Chunk.size + secondZ * Chunk.area;
        /**
         * If the new block face is needed.
         * @type {boolean}
         */
        let needsFace = false;
        if ((
            secondX >= 0
        ) && (
            secondX < Chunk.size
        ) && (
            secondY >= 0
        ) && (
            secondY < Chunk.size
        ) && (
            secondZ >= 0
        ) && (
            secondZ < Chunk.size
        )) {
            needsFace = this.needsBlockFace(firstIndex, secondIndex)
        } else {
            needsFace = this.needsBlockFaceAlt(firstIndex);
        }
        if (needsFace) return faceData;
        else return {position: [], uv: []};
    }

    /**
     * Set any threejs geometry attribute.
     * @param {string} name The threejs name of the attribute.
     * @param {number[]} values The values to set to.
     * @param {number} channels The number of channels.
     */
    setGeometryBufferAttribute(name, values, channels) {
        this.mesh.geometry.setAttribute(name, new BufferAttribute(new Float32Array(values), channels));
    }

    /**
     * Generate uv mappings for the up direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvYP(textureAtlasIndex) {
        return [
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0
        ];
    }

    /**
     * Generate uv mappings for the down direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvYM(textureAtlasIndex) {
        return [
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0
        ];
    }

    /**
     * Generate uv mappings for the north direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvZM(textureAtlasIndex) {
        return [
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0
        ];
    }

    /**
     * Generate uv mappings for the south direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvZP(textureAtlasIndex) {
        return [
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
        ];
    }

    /**
     * Generate uv mappings for the east direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvXM(textureAtlasIndex) {
        return [
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
        ];
    }

    /**
     * Generate uv mappings for the west direction.
     * @param {number} textureAtlasIndex The index in the texture atlas.
     * @returns {number[]} The uv map.
     */
    static generateBlockFaceUvXP(textureAtlasIndex) {
        return [
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 1,
            textureAtlasIndex / Chunk.atlasSize, 0,
            (textureAtlasIndex + 1) / Chunk.atlasSize, 0
        ];
    }

}
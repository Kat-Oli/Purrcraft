import { BufferAttribute, BufferGeometry, DoubleSide, Material, Mesh, MeshBasicMaterial } from "./lib/three.mjs";

/**
 * @typedef {{position:number[]}} BlockFaceGeometryData
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
     * The material applied to all chunks.
     * @type {Material}
     * @readonly
     */
    static material = new MeshBasicMaterial({color:0xffffff,side:DoubleSide});

    constructor() {
        /**
         * The threejs mesh used to render the chunk.
         * @type {Mesh}
         */
        this.mesh = new Mesh(
            new BufferGeometry(),
            Chunk.material
        );
        /**
         * The block data, an array of all blocks.
         * For now they will be booleans but that will change.
         * @type {boolean[]}
         */
        this.blockData = new Array(Chunk.volume);
        this.blockData.fill(false);
    }

    /**
     * Generates the block data for the chunk.
     */
    buildBlockData() {
        /**
         * The counter for the for loop.
         * @type {number}
         */
        let counter;
        /**
         * The random index to set the block.
         * @type {number}
         */
        let randomIndex;
        for (counter = 0; counter < 100; counter++) {
            randomIndex = Math.floor(Math.random()*Chunk.volume);
            this.blockData[randomIndex] = true;
        }
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
        for (firstX = 0; firstX < Chunk.size; firstX++)
        for (firstY = 0; firstY < Chunk.size; firstY++)
        for (firstZ = 0; firstZ < Chunk.size; firstZ++) {
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
                }
            ));
        }
        /**
         * The results unpacked into one block face data.
         * @type {BlockFaceGeometryData}
         */
        let unpackedResults = {
            position: []
        };
        results.forEach(item=>{
            unpackedResults.position.push(...item.position)
        });
        this.setGeometryBufferAttribute("position", unpackedResults.position, 3);
    }

    /**
     * Checks if a block face is needed between two blocks.
     * @param {number} firstIndex The index of the first block.
     * @param {number} secondIndex The index of the second block.
     * @returns {boolean} If the block face is needed.
     */
    needsBlockFace(firstIndex, secondIndex) {
        return this.blockData[firstIndex] && !this.blockData[secondIndex];
    }

    /**
     * Checks if a block face is needed between the block and a chunk edge.
     * @param {number} firstIndex The index of the block.
     * @returns {boolean} If the block face is needed.
     */
    needsBlockFaceAlt(firstIndex) {
        return this.blockData[firstIndex];
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
        else return {position: []};
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
}
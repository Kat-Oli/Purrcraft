/**
 * Represents a block.
 * This is the base class and is usually not used.
 */
export class Block {
    /**
     * Create an instance of this block type.
     */
    constructor() {
    }

    /**
     * The texture indexes of each side.
     * Each side is at index below.
     * 
     * 0. Top
     * 1. Side
     * 2. Bottom
     * @type {[number, number, number]}
     */
    get textures() {
        return [0, 0, 0];
    }

    /**
     * If the block is invisible.
     * @type {boolean}
     */
    get isInvisible() {
        return false;
    }
}
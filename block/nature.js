import { Block } from "../core/block.js";

/**
 * Represents a block of air.
 */
export class AirBlock extends Block {
    get isInvisible() {
        return true;
    }
}

/**
 * A block of dirt with a layer of grass on top.
 */
export class GrassBlock extends Block {
    get textures() {
        return [0, 1, 2];
    }
}

/**
 * A block of dirt.
 */
export class DirtBlock extends Block {
    get textures() {
        return [2, 2, 2];
    }
}

/**
 * A block of stone.
 */
export class StoneBlock extends Block {
    get textures() {
        return [3, 3, 3];
    }
}
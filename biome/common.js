import { SandBlock, StoneBlock } from "../block/nature.js";
import { Biome } from "../core/biome.js";
import { Noise } from "../core/noise.js";
import { defaultUndergroundBlockGenerator } from "../core/util.js";

/**
 * The grassland biome.
 * @type {Biome}
 */
export const grassland = new Biome(Noise.default, defaultUndergroundBlockGenerator);

/**
 * The desert biome.
 * @type {Biome}
 */
export const desert = new Biome(Noise.default, depth=>{
    if (depth < 3)
        return new SandBlock();
    else
        return new StoneBlock();
})
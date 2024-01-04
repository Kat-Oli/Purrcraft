import { Chunk } from "./chunk.js";
import { Display } from "./display.js";
import { Noise } from "./noise.js";
import { Terrain } from "./terrain.js";
import { World } from "./world.js";

/**
 * Manages everything in purrcraft.
 */
export class App {
    constructor() {
        /**
         * The display that draws the 3D scene.
         * @type {Display}
         */
        this.display = new Display(60, 0.1, 250, true);
        this.display.moveCamera(0, Chunk.size / 2, 0);
        /**
         * The game world.
         * @type {World}
         */
        this.world = new World(this.display.scene, 2, new Terrain([
            new Noise(10, 8)
        ]));
    }

    /**
     * Gets the app ready, called inside of run.
     */
    init() {

    }

    /**
     * Called every frame inside of run.
     */
    tick() {
        this.display.tick();
        this.world.tick(this.display.camera);
    }

    /**
     * Does everything.
     */
    run() {
        /**
         * The app instance.
         * @type {App}
         */
        const _this = this;
        _this.init();
        (function _loop() {
            _this.tick();
            requestAnimationFrame(_loop);
        })();
    }
}
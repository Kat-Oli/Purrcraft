import { Chunk } from "./chunk.js";
import { Display } from "./display.js";
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
        this.display.moveCamera(Chunk.size/2, Chunk.size/2, Chunk.size*2);
        /**
         * The game world.
         * @type {World}
         */
        this.world = new World(this.display.scene);
        this.world.addChunk(new Chunk());
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
        this.display.moveCamera(
            this.display.camera.position.x,
            this.display.camera.position.y,
            this.display.camera.position.z - 0.01,
        )
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
import { PerspectiveCamera, Scene, WebGLRenderer } from "./lib/three.mjs";

/**
 * Represents the display of all 3D objects.
 */
export class Display {
    /**
     * Create the display object.
     * @param {number} fov The angle of vision.
     * @param {number} near The nearest visible distance.
     * @param {number} far The farthest visible distance.
     * @param {boolean} aa Enable or disable antialias.
     */
    constructor(fov, near, far, aa) {
        /**
         * The threejs perspective camera.
         * @type {PerspectiveCamera}
         */
        this.camera = new PerspectiveCamera(fov, 1, near, far);
        /**
         * The threejs scene.
         * @type {Scene}
         */
        this.scene = new Scene();
        /**
         * The threejs webgl renderer.
         * @type {WebGLRenderer}
         */
        this.renderer = new WebGLRenderer({antialias: aa});
        document.body.appendChild(this.canvas);
    }

    /**
     * Draws the display after matching the size.
     */
    tick() {
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Move the camera to a position.
     * @param {number} x The new x position.
     * @param {number} y The new y position.
     * @param {number} z The new z position.
     */
    moveCamera(x,y,z) {
        this.camera.position.set(x,y,z);
    }

    /**
     * Move the camera with a velocity.
     * @param {number} x The new x position.
     * @param {number} y The new y position.
     * @param {number} z The new z position.
     */
    moveCameraBy(x, y, z) {
        this.camera.position.set(
            this.camera.position.x + x,
            this.camera.position.y + y,
            this.camera.position.z + z
        )
    }

    /**
     * The html canvas element used to show the graphics.
     * @type {HTMLCanvasElement}
     */
    get canvas() {
        return this.renderer.domElement;
    }

    /**
     * The width of the screen.
     * @type {number}
     */
    get width() {
        return innerWidth;
    }

    /**
     * The height of the screen.
     * @type {number}
     */
    get height() {
        return innerHeight;
    }

    /**
     * The aspect ratio of the screen.
     * @type {number}
     */
    get aspect() {
        return this.width / this.height;
    }
}
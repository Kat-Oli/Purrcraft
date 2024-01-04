import { Camera, Object3D, Vector3 } from "./lib/three.mjs";
import { World } from "./world.js";

/**
 * Represents the player.
 */
export class Player {
    constructor() {
        /**
         * The helper object.
         * @type {Object3D}
         * @private
         */
        this.helperObject = new Object3D();
        /**
         * If the player is allowed to jump.
         * @type {boolean}
         */
        this.canJump = false;
        /**
         * The velocity of the player.
         * @type {Vector3}
         */
        this.velocity = new Vector3(0, 0, 0);
        /**
         * The player.
         * @type {Player}
         */
        const _this = this;
        addEventListener("keydown", ev=>_this.onKeyDown(ev));
        addEventListener("keyup", ev=>_this.onKeyUp(ev));
        /**
         * Every pressed key.
         * @type {string[]}
         * @private
         */
        this.pressedKeys = [];
        this.helperObject.position.set(0,16,0)
    }

    /**
     * Tick the player.
     * @param {World} world The world.
     * @param {Camera} camera The camera.
     * @param {number} delta The time between the last frame and the one before it.
     */
    tick(world, camera, delta) {
        /**
         * The rounded down position of the player.
         */
        let fp = this.floorPosition;
        if (world.getBlockAt(fp.x, fp.y - 1, fp.z).isSolid) {
            this.velocity.y = 0;
            this.canJump = true;
            for (let stepUp = 0; stepUp < 0.3; stepUp += 0.01) {
                if (world.getBlockAt(fp.x, fp.y - 1 + stepUp, fp.z).isSolid) {
                    this.helperObject.position.set(fp.x, fp.y + stepUp, fp.z);
                }
            }
        }
        else {
            this.velocity.y -= delta * .5;
            this.canJump = false;
        }
        /**
         * The scaled velocity.
         * @type {Vector3}
         */
        let v = this.velocity.clone();
        v = v.multiplyScalar(delta);
        this.helperObject.position.add(v);
        this.triggerOnKeyHold();
        this.moveToHelper(camera);
    }

    /**
     * Trigger on key holds.
     * @private
     */
    triggerOnKeyHold() {
        this.pressedKeys.forEach(v=>this.onKeyHold(v));
    }

    /**
     * This function is run when a key is held.
     * @param {string} key The key.
     * @private
     */
    onKeyHold(key) {
        if (key == "w")
            this.helperObject.translateZ(-0.1);
        if (key == "s")
            this.helperObject.translateZ(0.1);
    }

    /**
     * This function is run when a key is pressed.
     * @param {KeyboardEvent} event The event.
     * @private
     */
    onKeyDown(event) {
        this.pressedKeys.push(event.key);
    }

    /**
     * This function is run when a key is released.
     * @param {KeyboardEvent} event The event.
     * @private
     */
    onKeyUp(event) {
        this.pressedKeys = this.pressedKeys.filter(i=>i!=event.key);
    }

    /**
     * Move the player to the helper object.
     * @param {Camera} cam The camera.
     * @private
     */
    moveToHelper(cam) {
        cam.position.set(...this.helperObject.position);
        cam.rotation.set(...this.helperObject.rotation);
    }

    /**
     * Get the position rounded down.
     * @type {Vector3}
     */
    get floorPosition() {
        return new Vector3(
            Math.floor(this.helperObject.position.x),
            Math.floor(this.helperObject.position.y),
            Math.floor(this.helperObject.position.z)
        )
    }
}
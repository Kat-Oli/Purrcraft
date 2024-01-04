import { Camera, Vector3 } from "./lib/three.mjs";
import { World } from "./world.js";

/**
 * Represents the player.
 */
export class Player {
    constructor() {
        /**
         * If the player is allowed to jump.
         * @type {boolean}
         */
        this.canJump = false;
        /**
         * The position of the player.
         * @type {Vector3}
         */
        this.position = new Vector3(0, 16, 0);
        /**
         * The velocity of the player.
         * @type {Vector3}
         */
        this.velocity = new Vector3(0, 0, 0);
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
            this.canJump = false;
            for (let stepUp = 0; stepUp < 0.3; stepUp += 0.01) {
                if (world.getBlockAt(fp.x, fp.y - 1 + stepUp, fp.z).isSolid) {
                    this.position.set(fp.x, fp.y + stepUp, fp.z);
                }
            }
        }
        else {
            this.velocity.y -= delta;
        }
        /**
         * The scaled velocity.
         * @type {Vector3}
         */
        let v = this.velocity.clone();
        v = v.multiplyScalar(delta);
        this.position.add(v);
        camera.position.set(...this.position);
    }

    /**
     * Get the position rounded down.
     * @type {Vector3}
     */
    get floorPosition() {
        return new Vector3(
            Math.floor(this.position.x),
            Math.floor(this.position.y),
            Math.floor(this.position.z)
        )
    }
}
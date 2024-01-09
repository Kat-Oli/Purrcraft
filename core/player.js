import { AxesHelper, Camera, Euler, Quaternion, Vector2, Vector3 } from "./lib/three.mjs";
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
         * The rotation of the player used in purrcraft.
         * @type {Vector2} 
         */
        this.rotation = new Vector2(0, 0, 0);
        /**
         * The rotation of the player used in threejs.
         * @type {Vector3}
         */
        this.actualRotation = new Vector3(0, 0, 0);
        /**
         * The velocity of the player.
         * @type {Vector3}
         */
        this.velocity = new Vector3(0, 0, 0);
        addEventListener("keydown", ev=>this.onKeyDown(ev));
        addEventListener("keyup", ev=>this.onKeyUp(ev));
        addEventListener("mousemove", ev=>this.onMouseMove(ev));
        document.body.requestPointerLock();
        /**
         * Every pressed key.
         * @type {string[]}
         * @private
         */
        this.pressedKeys = [];
    }

    /**
     * Tick the player.
     * @param {World} world The world.
     * @param {Camera} camera The camera.
     * @param {number} delta The time between the last frame and the one before it.
     */
    tick(world, camera, delta) {
        this.triggerOnKeyHold(delta);
        this.processCollision(world, delta);
        this.updateActualRotation();
        this.position.add(this.velocity.clone().multiplyScalar(delta));
        camera.position.set(...this.position);
        camera.rotation.set(...this.actualRotation);
    }

    /**
     * Updates the actual rotation.
     */
    updateActualRotation() {
        /**
         * The first axis angle.
         * @type {Quaternion}
         */
        let a = new Quaternion().setFromAxisAngle(new Vector3(0, -1, 0), this.rotation.x);
        /**
         * The second axis angle.
         * @type {Quaternion}
         */
        let b = new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), this.rotation.y);
        a.multiply(b);
        a.normalize();
        this.actualRotation.setFromEuler(new Euler().setFromQuaternion(a));
    }

    /**
     * Process and check for collisions.
     * @param {World} world The world to collide with.
     * @param {number} delta The delta time.
     * @private
     */
    processCollision(world, delta) {
        /**
         * The bottom position of the players feet.
         * @type {Vector3}
         */
        const feetPosition = this.position.clone().add(new Vector3(0,-1.8,0));
        /**
         * The top position of the players head.
         * @type {Vector3}
         */
        const headPosition = this.position.clone().add(new Vector3(0,0.2,0));
        this.processCollisionFeet(world, feetPosition, delta);
    }

    /**
     * Process collisions with the ground.
     * @param {World} world The world.
     * @param {Vector3} feetPosition The position of the feet.
     * @param {number} delta The delta time.
     */
    processCollisionFeet(world, feetPosition, delta) {
        if (this.processCollisionAt(world, feetPosition.x, feetPosition.y -0.008, feetPosition.z)) {
            this.canJump = true;
            for (let v = 0; v < Math.abs(this.velocity.y) + 0.05; v += 0.01) {
                if (!this.processCollisionAt(world, feetPosition.x, feetPosition.y + v, feetPosition.z)) {
                    this.position.y = feetPosition.y + v + 1.8;
                    break;
                }
            }
            this.velocity.y = 0;
        }
        else {
            this.canJump = false;
            this.velocity.y -= delta;
        }
    }

    /**
     * Process and check for collision at a block.
     * @param {World} world The world to collide with.
     * @param {number} x The x position.
     * @param {number} y The y position.
     * @param {number} z The z position.
     * @returns {boolean} If the block is solid.
     * @private
     */
    processCollisionAt(world, x, y, z) {
        return world.getBlockAt(Math.floor(x), Math.floor(y), Math.floor(z)).isSolid;
    }

    /**
     * Trigger on key holds.
     * @param {number} delta The time between the last frame and the one before it.
     * @private
     */
    triggerOnKeyHold(delta) {
        this.pressedKeys.forEach(v=>this.onKeyHold(v, delta));
    }

    /**
     * This function is run when a key is held.
     * @param {string} key The key.
     * @param {number} delta The time between the last frame and the one before it.
     * @private
     */
    onKeyHold(key, delta) {
        /**
         * The rotated movement on the x axis.
         * @type {number}
         */
        let moveX = 0;
        /**
         * The rotated movement on the y axis.
         * @type {number}
         */
        let moveY = 0;
        /**
         * The x axis rotation of the player.
         * @type {number}
         */
        const xr = this.rotation.x;
        if (key == "w") {
            moveX -= Math.sin(xr) * delta;
            moveY -= Math.cos(xr) * delta;
        }
        if (key == "s") {
            moveX += Math.sin(xr) * delta;
            moveY += Math.cos(xr) * delta;
        }
        if (key == "a") {
            moveX += Math.sin(xr + Math.PI / 2) * delta;
            moveY += Math.cos(xr + Math.PI / 2) * delta;
        }
        if (key == "d") {
            moveX -= Math.sin(xr + Math.PI / 2) * delta;
            moveY -= Math.cos(xr + Math.PI / 2) * delta;
        }
        this.position.x -= moveX * 5;
        this.position.z += moveY * 5;
    }

    /**
     * This function is run when a key is pressed.
     * @param {KeyboardEvent} event The event.
     * @private
     */
    onKeyDown(event) {
        if (event.repeat) return;
        if (event.key == " ") if (this.canJump) {
            this.position.y += 0.01;
            this.velocity.y = 3;
        };
        this.pressedKeys.push(event.key.toLowerCase());
        if (event.key == "escape") {
            document.body.requestPointerLock();
        }
    }

    /**
     * This function is run when a key is released.
     * @param {KeyboardEvent} event The event.
     * @private
     */
    onKeyUp(event) {
        this.pressedKeys = this.pressedKeys.filter(i=>i!=event.key.toLowerCase());
    }

    /**
     * This function is run when the move is moved.
     * @param {MouseEvent} event The event.
     */
    onMouseMove(event) {
        this.rotation.add(new Vector2(event.movementX, event.movementY).multiplyScalar(0.01));
    }
}
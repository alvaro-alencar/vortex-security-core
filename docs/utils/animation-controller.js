// Animation Controller
// Manages animation lifecycle and playback controls

export class AnimationController {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 1.0;
        this.frame = 0;
        this.time = 0;
        this.animationId = null;
        this.updateCallback = null;
        this.lastTimestamp = 0;
    }

    /**
     * Set the update callback function
     */
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    /**
     * Start animation
     */
    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        this.animate();
    }

    /**
     * Pause animation
     */
    pause() {
        this.isPaused = true;
        this.isPlaying = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Reset animation to beginning
     */
    reset() {
        this.pause();
        this.frame = 0;
        this.time = 0;

        if (this.updateCallback) {
            this.updateCallback(this.time, this.frame);
        }
    }

    /**
     * Set playback speed
     */
    setSpeed(speed) {
        this.speed = Math.max(0.1, Math.min(10, speed));
    }

    /**
     * Get current speed
     */
    getSpeed() {
        return this.speed;
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying) return;

        const timestamp = performance.now();
        const deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
        this.lastTimestamp = timestamp;

        // Update time based on speed
        this.time += deltaTime * this.speed;
        this.frame++;

        // Call update callback
        if (this.updateCallback) {
            this.updateCallback(this.time, this.frame);
        }

        // Continue loop
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Check if currently playing
     */
    isAnimationPlaying() {
        return this.isPlaying;
    }

    /**
     * Get current frame
     */
    getCurrentFrame() {
        return this.frame;
    }

    /**
     * Get current time
     */
    getCurrentTime() {
        return this.time;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.pause();
        this.updateCallback = null;
    }
}

export default AnimationController;

// Capítulo 1: A Lei - A Dança de Euler
// Visualizes e^(iθ) rotating around the unit circle

import CanvasUtils from '../utils/canvas-utils.js';

export class EulerVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.reset();
    }

    reset() {
        this.theta = 0;
        this.trail = [];
        this.maxTrailLength = 200;
    }

    update(time, frame) {
        const { ctx, width, height, centerX, centerY } = this.setup;

        // Clear with slight fade for trail effect
        CanvasUtils.clear(ctx, width, height, 0.15);

        // Draw axes
        CanvasUtils.drawAxes(ctx, centerX, centerY, width, height, 'rgba(255, 255, 255, 0.2)');

        // Draw unit circle
        const radius = Math.min(width, height) * 0.3;
        CanvasUtils.drawCircle(ctx, centerX, centerY, radius, 'rgba(100, 100, 255, 0.3)', false);

        // Update theta
        this.theta = time;

        // Calculate position using Euler's formula
        const x = centerX + radius * Math.cos(this.theta);
        const y = centerY + radius * Math.sin(this.theta);

        // Add to trail
        this.trail.push({ x, y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Draw trail
        if (this.trail.length > 1) {
            for (let i = 1; i < this.trail.length; i++) {
                const alpha = i / this.trail.length;
                const hue = 280 + (alpha * 80); // Purple to cyan
                ctx.strokeStyle = CanvasUtils.hslToRgb(hue, 80, 60, alpha * 0.8);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.stroke();
            }
        }

        // Draw line from center to point
        CanvasUtils.drawLine(ctx, centerX, centerY, x, y, 'rgba(255, 100, 100, 0.6)', 2);

        // Draw point (Consciência)
        CanvasUtils.drawCircle(ctx, x, y, 8, '#ff3366', true);
        CanvasUtils.drawCircle(ctx, x, y, 10, 'rgba(255, 51, 102, 0.3)', false);

        // Calculate complex number components
        const real = Math.cos(this.theta).toFixed(2);
        const imag = Math.sin(this.theta).toFixed(2);

        // Draw info text
        const textX = width - 20;
        const textY = 30;
        ctx.textAlign = 'right';
        CanvasUtils.drawText(ctx, `θ = ${this.theta.toFixed(2)} rad`, textX, textY, 14, '#00d4ff');
        CanvasUtils.drawText(ctx, `e^(iθ) = ${real} + ${imag}i`, textX, textY + 25, 14, '#00d4ff');

        // Draw labels
        ctx.textAlign = 'center';
        CanvasUtils.drawText(ctx, 'Reais (Ser / Não-Ser)', centerX, height - 10, 12, 'rgba(255, 255, 255, 0.5)');
        ctx.save();
        ctx.translate(15, centerY);
        ctx.rotate(-Math.PI / 2);
        CanvasUtils.drawText(ctx, 'Imaginários (O Giro)', 0, 0, 12, 'rgba(255, 255, 255, 0.5)');
        ctx.restore();
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return `
            <div class="control-group">
                <label for="trailLength">Comprimento do Rastro: <span id="trailLengthValue">200</span></label>
                <input type="range" id="trailLength" min="50" max="400" step="10" value="200" class="slider">
            </div>
        `;
    }

    handleControlChange(controlId, value) {
        if (controlId === 'trailLength') {
            this.maxTrailLength = parseInt(value);
            document.getElementById('trailLengthValue').textContent = value;
        }
    }
}

export default EulerVisualization;

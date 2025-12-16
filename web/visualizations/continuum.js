// Capítulo 5: O Espírito - Continuum Infinito
// 4000+ ultra-transparent vectors forming vortex

import CanvasUtils from '../utils/canvas-utils.js';

export class ContinuumVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.numVidas = 4000;
        this.reset();
    }

    reset() {
        this.time = 0;
        this.updateAngles();
    }

    updateAngles() {
        this.angulos = [];
        for (let i = 0; i < this.numVidas; i++) {
            this.angulos.push((i / this.numVidas) * Math.PI * 2);
        }
    }

    update(time, frame) {
        const { ctx, width, height, centerX, centerY } = this.setup;

        this.time = time;

        // Clear with very subtle fade to keep ghostly trails
        CanvasUtils.clear(ctx, width, height, 0.03);

        const radius = Math.min(width, height) * 0.4;

        // Ultra-transparent rendering for field effect
        ctx.globalAlpha = 0.03; // Very low alpha for emergent density

        // Draw all vectors at once (batch rendering for performance)
        for (let i = 0; i < this.numVidas; i++) {
            const angulo = this.angulos[i];

            // Smooth phase adjustment
            const fase = i * 0.05 * 0.01;
            const expansao = Math.abs(Math.sin(this.time + fase));

            // Calculate position
            const x = centerX + radius * expansao * Math.cos(angulo);
            const y = centerY + radius * expansao * Math.sin(angulo);

            // Color variation based on angle
            const hue = 180 + ((i / this.numVidas) * 60); // Cyan spectrum
            ctx.strokeStyle = CanvasUtils.hslToRgb(hue, 80, 70, 1);
            ctx.lineWidth = 0.5;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1.0; // Reset alpha

        // Draw glowing center
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - 20, centerY - 20, 40, 40);

        // Info text
        ctx.textAlign = 'center';
        CanvasUtils.drawText(
            ctx,
            `Densidade: ${this.numVidas} vetores sobrepostos.`,
            centerX,
            height - 50,
            13,
            '#00d4ff'
        );
        CanvasUtils.drawText(
            ctx,
            'O indivíduo desapareceu. Só resta o Campo.',
            centerX,
            height - 25,
            13,
            '#00d4ff'
        );
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return `
            <div class="control-group">
                <label for="density">Densidade: <span id="densityValue">4000</span></label>
                <input type="range" id="density" min="1000" max="6000" step="500" value="4000" class="slider">
            </div>
            <div class="control-group">
                <p style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 0.5rem;">
                    ⚠️ Alta densidade pode impactar performance
                </p>
            </div>
        `;
    }

    handleControlChange(controlId, value) {
        if (controlId === 'density') {
            this.numVidas = parseInt(value);
            this.updateAngles();
            document.getElementById('densityValue').textContent = value;
        }
    }
}

export default ContinuumVisualization;

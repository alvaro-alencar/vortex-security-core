// Capítulo 3: A Comunidade - Soma dos Sentidos
// 72 radial vectors creating emergent circle pattern

import CanvasUtils from '../utils/canvas-utils.js';

export class SomaSentidosVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.numVidas = 72;
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

        // Clear with fade
        CanvasUtils.clear(ctx, width, height, 0.08);

        const radius = Math.min(width, height) * 0.35;

        // Draw cada vida (linha radial)
        for (let i = 0; i < this.numVidas; i++) {
            const angulo = this.angulos[i];

            // Phase shift for wave effect
            const faseIndividual = i * 0.1;
            const expansao = Math.abs(Math.sin(this.time + faseIndividual));

            // Calculate end point
            const x = centerX + radius * expansao * Math.cos(angulo);
            const y = centerY + radius * expansao * Math.sin(angulo);

            // Draw line from center
            const hue = 200 + (i / this.numVidas) * 60; // Cyan to blue gradient
            ctx.strokeStyle = CanvasUtils.hslToRgb(hue, 80, 60, 0.4);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Draw point at end
            CanvasUtils.drawCircle(ctx, x, y, 2, CanvasUtils.hslToRgb(hue, 80, 80, 0.8), true);
        }

        // Draw center point (the vortex)
        CanvasUtils.drawCircle(ctx, centerX, centerY, 5, '#ffffff', true);
        CanvasUtils.drawCircle(ctx, centerX, centerY, 8, 'rgba(255, 255, 255, 0.3)', false);

        // Info text
        ctx.textAlign = 'center';
        CanvasUtils.drawText(
            ctx,
            'Nenhum círculo foi desenhado.',
            centerX,
            height - 50,
            13,
            '#00d4ff'
        );
        CanvasUtils.drawText(
            ctx,
            'A forma emerge da soma dos vetores.',
            centerX,
            height - 25,
            13,
            '#00d4ff'
        );

        // Show number of vectors
        ctx.textAlign = 'left';
        CanvasUtils.drawText(ctx, `Vetores: ${this.numVidas}`, 20, 30, 14, '#00d4ff');
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return `
            <div class="control-group">
                <label for="numVidas">Número de Vetores: <span id="numVidasValue">72</span></label>
                <input type="range" id="numVidas" min="18" max="144" step="18" value="72" class="slider">
            </div>
        `;
    }

    handleControlChange(controlId, value) {
        if (controlId === 'numVidas') {
            this.numVidas = parseInt(value);
            this.updateAngles();
            document.getElementById('numVidasValue').textContent = value;
        }
    }
}

export default SomaSentidosVisualization;

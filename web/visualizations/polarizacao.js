// Capítulo 4: A Alquimia - Polarização
// 1000 polarized vectors forming hexagram

import CanvasUtils from '../utils/canvas-utils.js';

export class PolarizacaoVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.numVidas = 1000;
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
        CanvasUtils.clear(ctx, width, height, 0.05);

        const radius = Math.min(width, height) * 0.35;

        // Draw each polarized life
        for (let i = 0; i < this.numVidas; i++) {
            const angulo = this.angulos[i];

            // Phase shift
            const faseIndividual = i * 0.02;
            const expansao = Math.abs(Math.sin(this.time + faseIndividual));

            // Calculate position
            const x = centerX + radius * expansao * Math.cos(angulo);
            const y = centerY + radius * expansao * Math.sin(angulo);

            // Polarization: color based on horizontal direction
            // cos(angle) = -1 (left/blue/spirit) to +1 (right/red/matter)
            const direcaoHorizontal = Math.cos(angulo);
            const color = CanvasUtils.getPolarizationColor(direcaoHorizontal);

            // Draw line
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Draw point
            ctx.globalAlpha = 0.5;
            CanvasUtils.drawCircle(ctx, x, y, 1.5, color, true);
            ctx.globalAlpha = 1.0;
        }

        // Draw center (the unity point - white/purple)
        CanvasUtils.drawCircle(ctx, centerX, centerY, 6, '#ffffff', true);
        CanvasUtils.drawCircle(ctx, centerX, centerY, 10, 'rgba(200, 100, 255, 0.6)', false);

        // Status text
        const expansao = Math.abs(Math.sin(this.time));
        let status;
        if (expansao < 0.1) {
            status = 'Estado: Retração ao Zero (Unidade Indiferenciada)';
        } else if (expansao > 0.9) {
            status = 'Estado: Expansão Máxima (Dualidade Manifesta)';
        } else {
            status = 'Estado: O Devir (Fluxo entre Polos)';
        }

        ctx.textAlign = 'left';
        CanvasUtils.drawText(ctx, status, 20, 30, 13, '#00d4ff');
        CanvasUtils.drawText(ctx, `Partículas: ${this.numVidas}`, 20, 55, 12, '#00d4ff');

        // Legend
        ctx.textAlign = 'right';
        CanvasUtils.drawText(ctx, 'Esquerda = Espírito (Azul)', width - 20, height - 50, 12, '#0066ff');
        CanvasUtils.drawText(ctx, 'Direita = Matéria (Vermelho)', width - 20, height - 30, 12, '#ff0033');
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return `
            <div class="control-group">
                <label for="numParticles">Partículas: <span id="numParticlesValue">1000</span></label>
                <input type="range" id="numParticles" min="500" max="2000" step="100" value="1000" class="slider">
            </div>
        `;
    }

    handleControlChange(controlId, value) {
        if (controlId === 'numParticles') {
            this.numVidas = parseInt(value);
            this.updateAngles();
            document.getElementById('numParticlesValue').textContent = value;
        }
    }
}

export default PolarizacaoVisualization;

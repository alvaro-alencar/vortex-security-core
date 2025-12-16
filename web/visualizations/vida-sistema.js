// Capítulo 2: A Angústia - Vida vs Sistema
// Shows the eternal system (red) vs finite human life (blue)

import CanvasUtils from '../utils/canvas-utils.js';

export class VidaSistemaVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.reset();
    }

    reset() {
        this.theta = 0;
        this.sistemaTrail = [];
        this.humanoTrail = [];
        this.humanoDead = false;
        this.humanoAlpha = 1.0;
        this.deathTheta = Math.PI * 2; // Dies after one full cycle
    }

    update(time, frame) {
        const { ctx, width, height, centerX, centerY } = this.setup;

        // Clear
        CanvasUtils.clear(ctx, width, height, 0.1);

        // Draw axes
        CanvasUtils.drawAxes(ctx, centerX, centerY, width, height, 'rgba(255, 255, 255, 0.15)');

        // Draw unit circle (the system's law)
        const radius = Math.min(width, height) * 0.3;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Update theta
        this.theta = time % (Math.PI * 4); // 2 full cycles

        // === SISTEMA (Red, Eternal) ===
        const sistemaX = centerX + radius * Math.cos(this.theta);
        const sistemaY = centerY + radius * Math.sin(this.theta);

        this.sistemaTrail.push({ x: sistemaX, y: sistemaY });
        if (this.sistemaTrail.length > 100) {
            this.sistemaTrail.shift();
        }

        // Draw sistema trail
        if (this.sistemaTrail.length > 1) {
            for (let i = 1; i < this.sistemaTrail.length; i++) {
                const alpha = i / this.sistemaTrail.length;
                ctx.strokeStyle = `rgba(255, 50, 50, ${alpha * 0.5})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.sistemaTrail[i - 1].x, this.sistemaTrail[i - 1].y);
                ctx.lineTo(this.sistemaTrail[i].x, this.sistemaTrail[i].y);
                ctx.stroke();
            }
        }

        // Draw sistema point
        CanvasUtils.drawCircle(ctx, sistemaX, sistemaY, 10, '#ff3333', true);

        // === VIDA HUMANA (Blue, Finite) ===
        if (!this.humanoDead) {
            // Projection on real axis (x-axis)
            const humanoX = centerX + radius * Math.cos(this.theta);
            const humanoY = centerY;

            this.humanoTrail.push({ x: humanoX, y: humanoY });

            // Draw humano trail (the linear timeline)
            if (this.humanoTrail.length > 1) {
                ctx.strokeStyle = 'rgba(50, 150, 255, 0.8)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(this.humanoTrail[0].x, this.humanoTrail[0].y);
                for (let i = 1; i < this.humanoTrail.length; i++) {
                    ctx.lineTo(this.humanoTrail[i].x, this.humanoTrail[i].y);
                }
                ctx.stroke();
            }

            // Draw humano point
            CanvasUtils.drawCircle(ctx, humanoX, humanoY, 9, '#3399ff', true);

            // Check for death
            if (this.theta >= this.deathTheta) {
                this.humanoDead = true;
            }
        } else {
            // Fade out
            this.humanoAlpha = Math.max(0, this.humanoAlpha - 0.01);

            // Draw fading trail
            if (this.humanoTrail.length > 1) {
                ctx.strokeStyle = `rgba(50, 150, 255, ${this.humanoAlpha * 0.8})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(this.humanoTrail[0].x, this.humanoTrail[0].y);
                for (let i = 1; i < this.humanoTrail.length; i++) {
                    ctx.lineTo(this.humanoTrail[i].x, this.humanoTrail[i].y);
                }
                ctx.stroke();
            }

            // Draw fading point at final position
            if (this.humanoTrail.length > 0) {
                const lastPos = this.humanoTrail[this.humanoTrail.length - 1];
                CanvasUtils.drawCircle(ctx, lastPos.x, lastPos.y, 9, `rgba(51, 153, 255, ${this.humanoAlpha})`, true);
            }
        }

        // Draw labels
        const labelY = height - 30;
        const labelX1 = centerX + radius + 20;
        const labelX2 = centerX - radius - 20;

        ctx.textAlign = 'left';
        CanvasUtils.drawText(ctx, 'Nascimento', labelX1, centerY + 5, 11, '#3399ff');
        ctx.textAlign = 'right';
        CanvasUtils.drawText(ctx, 'Morte', labelX2, centerY + 5, 11, '#3399ff');

        // Status text
        const progress = Math.min(100, (this.theta / this.deathTheta) * 100);
        const status = this.humanoDead ? 'FIM DO CICLO (Integração ao Zero/Memória)' : 'VIVO (Percorrendo a Linha Real)';

        ctx.textAlign = 'left';
        CanvasUtils.drawText(ctx, `Progresso da Vida: ${progress.toFixed(1)}%`, 20, 30, 13, '#00d4ff');
        CanvasUtils.drawText(ctx, `Estado: ${status}`, 20, 55, 13, this.humanoDead ? '#ff6666' : '#66ff66');
        CanvasUtils.drawText(ctx, 'O Sistema Vermelho continua girando...', 20, 80, 12, '#ff6666');
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return '';
    }

    handleControlChange(controlId, value) {
        // No extra controls for this visualization
    }
}

export default VidaSistemaVisualization;

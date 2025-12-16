// Capítulo 6: O Colapso - A Singularidade
// 5000 particles with wave propagation and gravitational collapse

import CanvasUtils from '../utils/canvas-utils.js';

export class SingularidadeVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.setup = CanvasUtils.setupCanvas(canvas);
        this.ctx = this.setup.ctx;

        this.numParticulas = 5000;
        this.reset();
    }

    reset() {
        this.time = 0;
        this.initParticles();
    }

    initParticles() {
        this.particulas = [];
        for (let i = 0; i < this.numParticulas; i++) {
            const angulo = (i / this.numParticulas) * Math.PI * 2;
            const raioBase = 0.8 + Math.random() * 0.8; // Random depth

            this.particulas.push({
                anguloBase: angulo,
                raioBase: raioBase
            });
        }
    }

    update(time, frame) {
        const { ctx, width, height, centerX, centerY } = this.setup;

        this.time = time;

        // Clear with fade for motion blur
        CanvasUtils.clear(ctx, width, height, 0.08);

        const maxRadius = Math.min(width, height) * 0.4;

        // Particle arrays for batch rendering
        const positions = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < this.numParticulas; i++) {
            const p = this.particulas[i];

            // Wave phase creates spiral interference pattern
            const wavePhase = Math.sin(this.time + p.anguloBase * 3);

            // Radial position (breathing + gravitational collapse)
            const raioAtual = p.raioBase * (0.2 + 0.8 * Math.abs(Math.sin(this.time + p.anguloBase * 0.5)));

            // Angular twist (vortex effect)
            const anguloAtual = p.anguloBase + this.time * 0.5 + (1 / raioAtual) * 0.2;

            // Calculate position
            const x = centerX + maxRadius * raioAtual * Math.cos(anguloAtual);
            const y = centerY + maxRadius * raioAtual * Math.sin(anguloAtual);

            // Color wave (traveling through particles)
            const colorPhase = Math.sin(anguloAtual * 2 - this.time * 3);

            // Map color to twilight spectrum
            // -1 to 1 -> dark blue to pink/white
            const hue = 260 + ((colorPhase + 1) / 2) * 80; // 260-340 (purple to pink)
            const lightness = 40 + ((colorPhase + 1) / 2) * 40; // 40-80
            const color = CanvasUtils.hslToRgb(hue, 80, lightness, 0.8);

            // Size based on radial distance (gravitational crushing near center)
            const size = raioAtual * raioAtual * 15 + 0.5;

            positions.push({ x, y });
            colors.push(color);
            sizes.push(size);
        }

        // Draw all particles
        for (let i = 0; i < positions.length; i++) {
            const { x, y } = positions[i];
            CanvasUtils.drawCircle(ctx, x, y, sizes[i], colors[i], true);
        }

        // Draw central singularity (black hole)
        const singularityGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 30
        );
        singularityGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        singularityGradient.addColorStop(0.6, 'rgba(100, 50, 150, 0.6)');
        singularityGradient.addColorStop(1, 'rgba(100, 50, 150, 0)');

        ctx.fillStyle = singularityGradient;
        ctx.fillRect(centerX - 30, centerY - 30, 60, 60);

        // Philosophical status that cycles
        const cycleIndex = Math.floor((this.time / 3) % 4);
        const statusTexts = [
            'Estado: Horizonte de Eventos. A matéria se desfaz.',
            'Estado: O Espelho Negro. A Onda olha para a Partícula.',
            'Estado: Singularidade. Tempo e Espaço colapsam.',
            'Estado: Reinício do Ciclo. O Vazio respira.'
        ];

        ctx.textAlign = 'center';
        const alpha = 0.5 + 0.5 * Math.abs(Math.sin(this.time));
        CanvasUtils.drawText(
            ctx,
            statusTexts[cycleIndex],
            centerX,
            height - 30,
            13,
            `rgba(0, 212, 255, ${alpha})`
        );
    }

    resize() {
        this.setup = CanvasUtils.setupCanvas(this.canvas);
        this.ctx = this.setup.ctx;
    }

    getControls() {
        return `
            <div class="control-group">
                <label for="numParticles2">Partículas: <span id="numParticles2Value">5000</span></label>
                <input type="range" id="numParticles2" min="1000" max="8000" step="500" value="5000" class="slider">
            </div>
            <div class="control-group">
                <p style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 0.5rem;">
                    ⚠️ Mais partículas = maior processamento
                </p>
            </div>
        `;
    }

    handleControlChange(controlId, value) {
        if (controlId === 'numParticles2') {
            this.numParticulas = parseInt(value);
            this.initParticles();
            document.getElementById('numParticles2Value').textContent = value;
        }
    }
}

export default SingularidadeVisualization;

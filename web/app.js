// Dancing Pi - Main Application Controller
// Manages navigation, canvas, and visualization switching

import AnimationController from './utils/animation-controller.js';
import CanvasUtils from './utils/canvas-utils.js';

// Import visualizations
import EulerVisualization from './visualizations/euler.js';
import VidaSistemaVisualization from './visualizations/vida-sistema.js';
import SomaSentidosVisualization from './visualizations/soma-sentidos.js';
import PolarizacaoVisualization from './visualizations/polarizacao.js';
import ContinuumVisualization from './visualizations/continuum.js';
import SingularidadeVisualization from './visualizations/singularidade.js';

class DancingPiApp {
    constructor() {
        // Chapter metadata
        this.chapters = {
            'euler': {
                number: '01',
                name: 'A Lei',
                title: 'A Lei: A Dança de Euler',
                description: 'A Identidade de Euler (e^(iπ) + 1 = 0). Para ir do Ser (1) ao Não-Ser (-1) sem se destruir, a realidade precisa rotacionar pelo plano imaginário.',
                vizClass: EulerVisualization
            },
            'vida-sistema': {
                number: '02',
                name: 'A Angústia',
                title: 'A Angústia: Vida vs Sistema',
                description: 'A dualidade entre o Tempo Linear (Humano) e o Tempo Cíclico (Eterno). A vida humana é uma projeção linear do sistema eterno que gira indiferente.',
                vizClass: VidaSistemaVisualization
            },
            'soma-sentidos': {
                number: '03',
                name: 'A Comunidade',
                title: 'A Comunidade: Soma dos Sentidos',
                description: 'Emergência e Gestalt. Nenhuma linha desenha o círculo - o círculo emerge da soma de vetores individuais. O centro revela um vórtice harmônico.',
                vizClass: SomaSentidosVisualization
            },
            'polarizacao': {
                number: '04',
                name: 'A Alquimia',
                title: 'A Alquimia: Polarização',
                description: 'A União dos Opostos (Mysterium Coniunctionis). 1000 vidas polarizadas (Direita=Matéria/Vermelho, Esquerda=Espírito/Azul) se auto-organizam em hexagrama.',
                vizClass: PolarizacaoVisualization
            },
            'continuum': {
                number: '05',
                name: 'O Espírito',
                title: 'O Espírito: Continuum Infinito',
                description: 'Teoria de Campo e Dissolução do Ego. No limite do infinito (4000+ vetores), a linha individual desaparece. Resta apenas o Campo - a espiral áurea.',
                vizClass: ContinuumVisualization
            },
            'singularidade': {
                number: '06',
                name: 'O Colapso',
                title: 'O Colapso: A Singularidade',
                description: 'Dualidade Onda-Partícula e Horizonte de Eventos. 5000 partículas comportam-se como fluido espelhado. A cor viaja através da matéria. Big Bounce.',
                vizClass: SingularidadeVisualization
            }
        };

        this.currentChapter = 'euler';
        this.currentVisualization = null;
        this.animationController = new AnimationController();
        this.fpsCounter = CanvasUtils.createFPSCounter();

        this.init();
    }

    init() {
        // DOM elements
        this.landing = document.getElementById('landing');
        this.app = document.getElementById('app');
        this.canvas = document.getElementById('mainCanvas');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dynamicControls = document.getElementById('dynamicControls');

        // Bind events
        this.bindEvents();

        // Setup resize observer
        this.setupResizeObserver();
    }

    bindEvents() {
        // Landing page enter button
        document.getElementById('enterBtn').addEventListener('click', () => {
            this.enterApp();
        });

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const chapter = link.dataset.chapter;
                this.switchChapter(chapter);
            });
        });

        // Animation controls
        document.getElementById('playBtn').addEventListener('click', () => {
            this.animationController.play();
            this.updatePlayPauseButtons(true);
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.animationController.pause();
            this.updatePlayPauseButtons(false);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetVisualization();
        });

        // Speed slider
        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.animationController.setSpeed(speed);
            document.getElementById('speedValue').textContent = `${speed.toFixed(1)}x`;
        });

        // Screenshot
        document.getElementById('screenshotBtn').addEventListener('click', () => {
            this.captureScreenshot();
        });

        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Menu toggle - collapses sidebar
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.nav-sidebar').classList.toggle('collapsed');
        });

        // Controls toggle
        document.getElementById('controlsToggle').addEventListener('click', () => {
            const content = document.querySelector('.controls-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'grid' : 'none';
        });
    }

    setupResizeObserver() {
        const resizeObserver = new ResizeObserver(() => {
            if (this.currentVisualization) {
                this.currentVisualization.resize();
            }
        });
        resizeObserver.observe(this.canvas.parentElement);
    }

    enterApp() {
        this.landing.style.opacity = '0';
        setTimeout(() => {
            this.landing.classList.remove('active');
            this.app.classList.add('active');
            this.loadChapter(this.currentChapter);
        }, 600);
    }

    switchChapter(chapterKey) {
        if (chapterKey === this.currentChapter) return;

        this.currentChapter = chapterKey;

        // Update nav active state
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.chapter === chapterKey);
        });

        // Reload chapter
        this.loadChapter(chapterKey);
    }

    loadChapter(chapterKey) {
        const chapter = this.chapters[chapterKey];

        // Update chapter info
        document.getElementById('chapterNumber').textContent = chapter.number;
        document.getElementById('chapterTitle').textContent = chapter.title;
        document.getElementById('chapterDescription').textContent = chapter.description;

        // Stop current animation
        if (this.animationController) {
            this.animationController.pause();
        }

        // Create new visualization
        this.currentVisualization = new chapter.vizClass(this.canvas);

        // Load dynamic controls
        this.dynamicControls.innerHTML = this.currentVisualization.getControls();

        // Bind control events
        this.bindDynamicControls();

        // Setup animation callback
        this.animationController.setUpdateCallback((time, frame) => {
            this.currentVisualization.update(time, frame);

            // Update FPS
            const fps = this.fpsCounter.update();
            document.getElementById('fps').textContent = `FPS: ${fps}`;
        });

        // Reset and start
        this.resetVisualization();
        this.animationController.play();
        this.updatePlayPauseButtons(true);
    }

    bindDynamicControls() {
        const controls = this.dynamicControls.querySelectorAll('input, select');
        controls.forEach(control => {
            control.addEventListener('input', (e) => {
                this.currentVisualization.handleControlChange(e.target.id, e.target.value);
            });
        });
    }

    resetVisualization() {
        if (this.currentVisualization) {
            this.currentVisualization.reset();
            this.animationController.reset();
        }
    }

    updatePlayPauseButtons(isPlaying) {
        document.getElementById('playBtn').classList.toggle('active', isPlaying);
        document.getElementById('pauseBtn').classList.toggle('active', !isPlaying);
    }

    captureScreenshot() {
        const link = document.createElement('a');
        link.download = `dancing-pi-${this.currentChapter}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    toggleFullscreen() {
        const container = document.querySelector('.canvas-container');

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dancingPiApp = new DancingPiApp();
});

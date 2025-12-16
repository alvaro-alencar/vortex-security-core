// Canvas Utilities for Dancing Pi
// High-DPI canvas setup and common drawing functions

export class CanvasUtils {
    /**
     * Setup canvas for high-DPI displays (Retina, etc.)
     */
    static setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        return {
            ctx,
            width: rect.width,
            height: rect.height,
            centerX: rect.width / 2,
            centerY: rect.height / 2,
            dpr
        };
    }

    /**
     * Clear canvas with optional fade effect
     */
    static clear(ctx, width, height, fadeAlpha = 1) {
        if (fadeAlpha < 1) {
            ctx.fillStyle = `rgba(10, 10, 15, ${fadeAlpha})`;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, width, height);
        }
    }

    /**
     * Convert HSL to RGB string
     */
    static hslToRgb(h, s, l, a = 1) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    /**
     * Interpolate between two colors
     */
    static lerpColor(color1, color2, t) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Get color from blue-white-red gradient (for polarization)
     */
    static getPolarizationColor(value) {
        // value from -1 (blue) to +1 (red)
        const normalized = (value + 1) / 2; // 0 to 1
        
        if (normalized < 0.5) {
            // Blue to White
            const t = normalized * 2;
            return this.lerpColor('#0066ff', '#ffffff', t);
        } else {
            // White to Red
            const t = (normalized - 0.5) * 2;
            return this.lerpColor('#ffffff', '#ff0033', t);
        }
    }

    /**
     * Draw a circle
     */
    static drawCircle(ctx, x, y, radius, color, fill = true) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    /**
     * Draw a line
     */
    static drawLine(ctx, x1, y1, x2, y2, color, lineWidth = 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    /**
     * Draw text with glow effect
     */
    static drawText(ctx, text, x, y, size = 14, color = '#ffffff', align = 'left') {
        ctx.font = `${size}px Inter, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        
        // Glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
    }

    /**
     * FPS Counter
     */
    static createFPSCounter() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;

        return {
            update() {
                frames++;
                const now = performance.now();
                
                if (now >= lastTime + 1000) {
                    fps = Math.round((frames * 1000) / (now - lastTime));
                    frames = 0;
                    lastTime = now;
                }
                
                return fps;
            },
            getFPS() {
                return fps;
            }
        };
    }

    /**
     * Map value from one range to another
     */
    static map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Linear interpolation
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * Draw grid for debugging
     */
    static drawGrid(ctx, width, height, step = 50, color = 'rgba(255, 255, 255, 0.1)') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    /**
     * Draw axes (for mathematical visualizations)
     */
    static drawAxes(ctx, centerX, centerY, width, height, color = 'rgba(255, 255, 255, 0.3)') {
        this.drawLine(ctx, 0, centerY, width, centerY, color, 1);
        this.drawLine(ctx, centerX, 0, centerX, height, color, 1);
    }
}

export default CanvasUtils;

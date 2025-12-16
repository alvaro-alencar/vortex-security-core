import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Configuração da figura
fig, ax = plt.subplots(figsize=(8, 8))
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.axhline(0, color='black', linewidth=1) # Eixo Real
ax.axvline(0, color='black', linewidth=1) # Eixo Imaginário
ax.set_aspect('equal')
ax.grid(True, linestyle='--', alpha=0.6)
ax.set_title("A Dança de Euler: $e^{i\\theta}$", fontsize=14)
ax.set_xlabel("Reais (Ser / Não-Ser)")
ax.set_ylabel("Imaginários (O Giro)")

# Elementos gráficos
circle = plt.Circle((0, 0), 1, color='blue', fill=False, linestyle=':', alpha=0.5)
ax.add_artist(circle)
point, = ax.plot([], [], 'ro', markersize=10, label='Consciência')
line, = ax.plot([], [], 'r-', alpha=0.3)
text_val = ax.text(-1.2, 1.2, '', fontsize=12)

# Dados da trajetória (0 a PI)
frames = 200
thetas = np.linspace(0, 2 * np.pi, frames)

def init():
    point.set_data([], [])
    line.set_data([], [])
    text_val.set_text('')
    return point, line, text_val

def update(frame):
    theta = thetas[frame]
    z = np.exp(1j * theta)
    x, y = z.real, z.imag
    
    point.set_data([x], [y])
    
    history_z = np.exp(1j * thetas[:frame+1])
    line.set_data(history_z.real, history_z.imag)
    
    text_val.set_text(f'θ = {theta:.2f} rad\n$e^{{i\\theta}}$ = {x:.2f} + {y:.2f}i')
    
    return point, line, text_val

ani = FuncAnimation(fig, update, frames=frames, init_func=init, blit=True, interval=20)

# Essa é a linha que faz a mágica acontecer no VS Code
plt.show()

print("Gerando GIF... (Isso pode levar uns segundos)")
ani.save('danca_euler.gif', writer='pillow', fps=30)
print("GIF salvo com sucesso na pasta do projeto!")
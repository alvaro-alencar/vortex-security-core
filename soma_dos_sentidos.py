import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# --- CONFIGURAÇÃO ---
# Quantas "vidas" (linhas azuis) precisamos para formar o todo?
NUM_VIDAS = 72  # 72 é um número místico/cabala, mas funciona bem visualmente
frames = 200

fig, ax = plt.subplots(figsize=(9, 9))
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.set_aspect('equal')
ax.axis('off') # Sem eixos, apenas o vazio
ax.set_facecolor('black') # Fundo preto para ressaltar a luz
fig.patch.set_facecolor('black')

ax.set_title(f"A Soma dos Sentidos: {NUM_VIDAS} Vidas Lineares", color='white', fontsize=15, pad=20)

# --- ESTRUTURA DE DADOS ---
# Cada vida tem um ângulo (um "Sentido") único
angulos = np.linspace(0, 2*np.pi, NUM_VIDAS, endpoint=False)

# Vamos criar uma coleção de linhas
linhas = []
pontos_finais = []

# Inicializa as linhas (todas começam no centro, no Zero)
for _ in range(NUM_VIDAS):
    ln, = ax.plot([], [], color='#4da6ff', linewidth=1, alpha=0.4) # Azul Ciano
    pt, = ax.plot([], [], 'o', color='white', markersize=2, alpha=0.8) # A "alma" na ponta
    linhas.append(ln)
    pontos_finais.append(pt)

# Texto filosófico dinâmico
texto = ax.text(0, -1.3, '', color='white', fontsize=10, ha='center', va='center')

def init():
    for ln in linhas:
        ln.set_data([], [])
    for pt in pontos_finais:
        pt.set_data([], [])
    texto.set_text('')
    return linhas + pontos_finais + [texto]

def update(frame):
    # O tempo pulsa (respiração do universo)
    # Vai de 0 a 1 e volta a 0 (Senoidal)
    t = frame / frames * 2 * np.pi
    expansao = abs(np.sin(t)) # O pulso da vida
    
    # Atualiza cada vida individual
    for i, angulo in enumerate(angulos):
        # Cada vida segue seu PRÓPRIO SENTIDO (ângulo)
        # Mas todas obedecem ao mesmo ritmo (tempo)
        
        # Introduzimos uma pequena variação de fase para nem todos nascerem juntos
        # Isso cria o efeito de "onda" em vez de explosão rígida
        fase_individual = i * 0.1
        expansao_local = abs(np.sin(t + fase_individual))
        
        # Coordenadas da ponta da linha
        x = expansao_local * np.cos(angulo)
        y = expansao_local * np.sin(angulo)
        
        # A linha vai do Centro (Zero) até a Ponta (Devir)
        linhas[i].set_data([0, x], [0, y])
        pontos_finais[i].set_data([x], [y])
        
        # Mágica Visual:
        # Quando a linha atinge o máximo (raio 1), ela define a borda
        # Se ela for curta, ela é apenas ruído interno.
    
    texto.set_text("Nenhum círculo foi desenhado.\nA forma emerge da soma dos vetores.")
    
    return linhas + pontos_finais + [texto]

ani = FuncAnimation(fig, update, frames=frames, init_func=init, blit=True, interval=30)

print("Gerando GIF... (Isso pode levar uns segundos)")
ani.save('soma_dos_sentidos.gif', writer='pillow', fps=30)
print("GIF salvo com sucesso na pasta do projeto!")
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import matplotlib.cm as cm
import matplotlib.colors as mcolors

# --- CONFIGURAÇÃO DE MASSA CRÍTICA ---
NUM_VIDAS = 1000  # A multidão
frames = 150      # O tempo do respiro

print(f"Iniciando simulação para {NUM_VIDAS} vidas polarizadas...")

fig, ax = plt.subplots(figsize=(10, 10)) # Um pouco maior para ver detalhes
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.set_aspect('equal')
ax.axis('off')
ax.set_facecolor('black')
fig.patch.set_facecolor('black')

# Título Filosófico
ax.set_title(f"Polarização Ontológica: {NUM_VIDAS} Vidas\n(Esquerda=Azul/Espírito | Direita=Vermelho/Matéria)", 
             color='white', fontsize=14, pad=20)

# --- MAPA DE CORES (O Espectro da Polarização) ---
# Usaremos um mapa 'bwr' (Blue-White-Red). 
# O centro (branco) parecerá roxo por causa do fundo preto e transparência.
cmap = plt.get_cmap('bwr')
# Normalizador: Mapeia o cosseno (que vai de -1 a +1) para o mapa de cores (0 a 1)
norm = mcolors.Normalize(vmin=-1.0, vmax=1.0)

# --- ESTRUTURA DE DADOS ---
angulos = np.linspace(0, 2*np.pi, NUM_VIDAS, endpoint=False)

linhas = []
pontos_finais = []

# Inicialização com Cores Baseadas no Ângulo
for i, angulo in enumerate(angulos):
    # Calcula a "direção horizontal" (-1 é esquerda total, +1 é direita total)
    direcao_horizontal = np.cos(angulo)
    
    # Define a cor baseada nessa direção
    cor_vida = cmap(norm(direcao_horizontal))
    
    # Linhas mais finas e transparentes para aguentar 1000 sobreposições
    ln, = ax.plot([], [], color=cor_vida, linewidth=0.6, alpha=0.3)
    pt, = ax.plot([], [], 'o', color=cor_vida, markersize=1.5, alpha=0.5)
    linhas.append(ln)
    pontos_finais.append(pt)

# Texto dinâmico
texto = ax.text(0, -1.3, '', color='white', fontsize=11, ha='center')

def init():
    for ln in linhas: ln.set_data([], [])
    for pt in pontos_finais: pt.set_data([], [])
    texto.set_text('')
    return linhas + pontos_finais + [texto]

def update(frame):
    # O ritmo da respiração
    t = frame / frames * 2 * np.pi
    expansao = abs(np.sin(t))
    
    for i, angulo in enumerate(angulos):
        # A defasagem cria o movimento orgânico
        fase_individual = i * 0.02 # Ajustei a fase para 1000 vidas
        expansao_local = abs(np.sin(t + fase_individual))
        
        x = expansao_local * np.cos(angulo)
        y = expansao_local * np.sin(angulo)
        
        linhas[i].set_data([0, x], [0, y])
        pontos_finais[i].set_data([x], [y])
    
    # Mensagem dependendo da fase da respiração
    if expansao < 0.1:
        status = "Estado: Retração ao Zero (Unidade Indiferenciada)"
    elif expansao > 0.9:
        status = "Estado: Expansão Máxima (Dualidade Manifesta)"
    else:
        status = "Estado: O Devir (Fluxo entre Polos)"
        
    texto.set_text(status)
    
    if frame % 25 == 0:
        print(f"Renderizando frame {frame}/{frames}...")
        
    return linhas + pontos_finais + [texto]

# Criar e Salvar
ani = FuncAnimation(fig, update, frames=frames, init_func=init, blit=True, interval=40)

print("Gerando GIF de alta densidade... Aguarde.")
# Nome do arquivo reflete a nova experiência
ani.save('polarizacao_1000_vidas.gif', writer='pillow', fps=30)
print(">>> GIF 'polarizacao_1000_vidas.gif' GERADO COM SUCESSO! <<<")
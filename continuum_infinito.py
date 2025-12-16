import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# --- O LIMITE DO INFINITO (Simulação) ---
# 4000 é o nosso "Infinito Computável".
# Se aumentarmos mais, o Python engasga.
NUM_VIDAS = 4000  
frames = 120

print(f"Calculando o Continuum ({NUM_VIDAS} vetores)... A ventoinha do PC pode ligar.")

fig, ax = plt.subplots(figsize=(10, 10))
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.set_aspect('equal')
ax.axis('off')
ax.set_facecolor('black')
fig.patch.set_facecolor('black')

ax.set_title("O Continuum: Limite Tendendo ao Infinito\n(A dissolução da Linha na Forma Pura)", 
             color='white', fontsize=14, pad=20)

# --- DADOS ---
angulos = np.linspace(0, 2*np.pi, NUM_VIDAS, endpoint=False)

# --- A MÁGICA DA TRANSPARÊNCIA ---
# Não usamos plot() normal aqui, pois ficaria um borrão sólido.
# Usamos uma coleção de linhas com alpha MUITO baixo.
# A "forma" surgirá apenas da SOMA das transparências.
from matplotlib.collections import LineCollection

# Criamos a coleção vazia inicial
linhas_collection = LineCollection([], colors='#4da6ff', linewidths=0.5, alpha=0.03) # Alpha 0.03 é fantasmagórico
ax.add_collection(linhas_collection)

texto = ax.text(0, -1.4, '', color='white', fontsize=10, ha='center')

def init():
    linhas_collection.set_segments([])
    texto.set_text('')
    return linhas_collection, texto

def update(frame):
    t = frame / frames * 2 * np.pi
    
    # Respiração do Universo
    expansao_base = abs(np.sin(t))
    
    # Gerando as coordenadas de TODAS as linhas de uma vez (Vetorização NumPy para performance)
    # Isso substitui o loop "for" que seria lento demais para 4000 vidas
    fases = np.linspace(0, NUM_VIDAS * 0.05, NUM_VIDAS) # Defasagem suave
    expansao_local = np.abs(np.sin(t + phases_adjustment(fases))) # Função auxiliar abaixo
    
    # Matematicamente, a ponta da linha é:
    x = expansao_local * np.cos(angulos)
    y = expansao_local * np.sin(angulos)
    
    # Criar segmentos: Do (0,0) até (x,y)
    # Formato necessário para LineCollection: Lista de [[x0, y0], [x1, y1]]
    zeros = np.zeros_like(x)
    # Empilha as coordenadas para criar os pares (0,0) -> (x,y)
    start_points = np.column_stack((zeros, zeros))
    end_points = np.column_stack((x, y))
    segments = np.stack((start_points, end_points), axis=1)
    
    linhas_collection.set_segments(segments)
    
    # Muda a cor baseado na densidade (opcional, mas mantive o azul puro para ver a luz)
    
    texto.set_text(f"Densidade: {NUM_VIDAS} vetores sobrepostos.\nO indivíduo desapareceu. Só resta o Campo.")
    
    if frame % 10 == 0:
        print(f"Renderizando frame {frame}/{frames}...")
        
    return linhas_collection, texto

def phases_adjustment(fases):
    # Pequeno ajuste para garantir que não seja aleatório, mas fluido
    return fases * 0.01

ani = FuncAnimation(fig, update, frames=frames, init_func=init, blit=True, interval=40)

print("Gerando GIF do Continuum... Isso exige processamento.")
ani.save('continuum_infinito.gif', writer='pillow', fps=30)
print("GIF salvo.")
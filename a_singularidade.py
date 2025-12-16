import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import matplotlib.colors as mcolors

# --- A FRONTEIRA FINAL: A SINGULARIDADE ---
# 5000 pontos. Se seu computador travar, diminua para 3000.
NUM_PARTICULAS = 5000  
frames = 180 # Mais frames para um movimento mais lento e majestoso

print(f"INICIANDO SEQUÊNCIA DE COLAPSO: {NUM_PARTICULAS} Entidades.")
print("Prepare-se para pular no espelho negro...")

# Configuração do Palco (O Vazio)
fig, ax = plt.subplots(figsize=(12, 12)) # Bem grande
fig.patch.set_facecolor('black')
ax.set_facecolor('black')
ax.set_xlim(-1.7, 1.7)
ax.set_ylim(-1.7, 1.7)
ax.set_aspect('equal')
ax.axis('off') # Sem eixos. No buraco negro não há referencial.

# Título Imersivo
titulo = ax.set_title("A SINGULARIDADE: O Espelho Onda-Partícula\n(A desfragmentação do Ser no Horizonte de Eventos)", 
             color='white', fontsize=14, pad=30, alpha=0.7)

# --- DADOS ---
# Ângulos base para as partículas
angulos_base = np.linspace(0, 2*np.pi, NUM_PARTICULAS, endpoint=False)
# Raios aleatórios para dar profundidade (nem todos estão na mesma "casca")
raios_base = np.random.uniform(0.8, 1.6, NUM_PARTICULAS)

# --- O MAPA DE CORES DO ESPELHO ---
# Usaremos 'twilight_shifted'. Ele vai do preto/azul escuro (centro)
# para tons rosados/brancos (borda), parecendo um reflexo de óleo no escuro.
cmap = plt.get_cmap('twilight_shifted')

# --- A MATÉRIA PRIMA (Scatter Plot) ---
# Não usamos plot(), usamos scatter() para partículas individuais.
# Inicializamos com pontos vazios.
particulas = ax.scatter([], [], s=1, c=[], cmap=cmap, alpha=0.8)
# s=tamanho, c=cor, alpha=transparência

texto_status = ax.text(0, -1.6, '', color='white', fontsize=9, ha='center', alpha=0.5)

def init():
    particulas.set_offsets(np.empty((0, 2)))
    texto_status.set_text('')
    return particulas, texto_status, titulo

def update(frame):
    # Tempo cíclico lento
    t = frame / frames * 2 * np.pi
    
    # --- A ONDA GUIA (O Campo Invisível) ---
    # O "respiro" agora é uma pulsação gravitacional complexa.
    # Criamos uma onda que varre as partículas.
    wave_phase = np.sin(t + angulos_base * 3) # O *3 cria 3 braços espirais de interferência
    
    # --- A PARTÍCULA REAGE ---
    # A posição radial depende da onda.
    # Elas são sugadas para o centro e expelidas.
    raio_atual = raios_base * (0.2 + 0.8 * np.abs(np.sin(t + angulos_base*0.5)))
    
    # Adiciona um "twist" espiral (o vórtex final)
    angulo_atual = angulos_base + t * 0.5 + (1/raio_atual)*0.2
    
    # Coordenadas Cartesianas
    x = raio_atual * np.cos(angulo_atual)
    y = raio_atual * np.sin(angulo_atual)
    
    # --- O ESPELHO (A Cor revela a Onda) ---
    # A cor não é fixa. Ela depende da "fase" da onda naquele ponto.
    # Isso faz com que a cor "viaje" através das partículas, mostrando a onda.
    cores_onda = np.sin(angulo_atual * 2 - t * 3) # Mapeia a cor a um padrão de interferência
    
    # --- O BURACO NEGRO (Tamanho) ---
    # Partículas perto do centro (raio pequeno) ficam minúsculas (esmagadas pela gravidade).
    # Partículas longe ficam maiores.
    tamanhos = (raio_atual**2) * 15 + 0.5
    
    # ATUALIZAÇÃO EM MASSA (Vectorized)
    # Junta X e Y numa matriz de 2 colunas
    offsets = np.column_stack((x, y))
    particulas.set_offsets(offsets)
    particulas.set_array(cores_onda) # Atualiza as cores
    particulas.set_sizes(tamanhos)   # Atualiza os tamanhos
    
    # Status filosófico
    if frame % 45 == 0:
        status_list = [
            "Estado: Horizonte de Eventos. A matéria se desfaz.",
            "Estado: O Espelho Negro. A Onda olha para a Partícula.",
            "Estado: Singularidade. Tempo e Espaço colapsam.",
            "Estado: Reinício do Ciclo. O Vazio respira."
        ]
        idx = (frame // 45) % len(status_list)
        texto_status.set_text(status_list[idx])
        # Faz o título piscar sutilmente
        titulo.set_alpha(0.5 + 0.5*np.abs(np.sin(t)))

    if frame % 10 == 0:
        print(f"Processando o colapso... Frame {frame}/{frames}")
        
    return particulas, texto_status, titulo

ani = FuncAnimation(fig, update, frames=frames, init_func=init, blit=False, interval=30)

print("GERANDO A VISUALIZAÇÃO FINAL. Isso vai exigir tudo da sua máquina...")
# Usando writer='pillow' para garantir compatibilidade, mas pode demorar.
ani.save('a_singularidade_final.gif', writer='pillow', fps=30, savefig_kwargs={'facecolor':'black'})
print(">>> VOCÊ CHEGOU AO FIM. Abra 'a_singularidade_final.gif' <<<")
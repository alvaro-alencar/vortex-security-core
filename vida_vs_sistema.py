import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# --- CONFIGURAÇÃO DO PALCO ---
fig, ax = plt.subplots(figsize=(9, 9))
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.axhline(0, color='black', linewidth=1, alpha=0.5) # Eixo Real (Vida Visível)
ax.axvline(0, color='black', linewidth=1, alpha=0.5) # Eixo Imaginário (Potência Oculta)
ax.set_aspect('equal')
# Desligando o grid para focar na dualidade
ax.grid(False)
ax.set_facecolor('#f0f0f5') # Fundo levemente cinza para destacar

# Títulos e Legendas Filosóficas
ax.set_title("A Tensão Fundamental: Ciclo Eterno vs. Vida Finita", fontsize=14, pad=20)
ax.set_xlabel("Eixo Real (Matéria / Resultados Visíveis)", fontsize=10)
ax.set_ylabel("Eixo Imaginário (Energia / Processos Invisíveis)", fontsize=10)

# O Círculo Unitário (A Lei do Sistema)
circle = plt.Circle((0, 0), 1, color='gray', fill=False, linestyle='--', alpha=0.3)
ax.add_artist(circle)

# --- OS ATORES ---

# 1. O SISTEMA (Vermelho, Eterno)
# Ele gira no plano complexo completo.
sistema_point, = ax.plot([], [], 'ro', markersize=12, label='O Sistema (Ciclo Eterno Recursivo)', zorder=5)
sistema_trail, = ax.plot([], [], 'r-', linewidth=2, alpha=0.3)

# 2. A VIDA HUMANA (Azul, Finita)
# Ela é uma PROJEÇÃO no eixo real e tem data para acabar.
humano_point, = ax.plot([], [], 'bo', markersize=10, label='Vida Humana (Projeção Linear Finita)', zorder=6)
humano_trail, = ax.plot([], [], 'b-', linewidth=4, alpha=0.5) # Rastro mais grosso no eixo real

# Textos informativos
status_text = ax.text(-1.4, 1.3, '', fontsize=11, bbox=dict(facecolor='white', alpha=0.8))
nascimento_label = ax.text(1.05, 0.05, 'Nascimento\n(Início do Ciclo)', fontsize=9, color='blue', alpha=0.7)
morte_label = ax.text(-1.4, 0.05, 'Antítese/Morte\n(Meio do Caminho)', fontsize=9, color='blue', alpha=0.7)

ax.legend(loc='lower left', frameon=True)

# --- A LÓGICA DO TEMPO ---
# Vamos simular 2 ciclos completos do sistema para mostrar que ele continua após a "morte" humana.
ciclos_sistema = 2.0
frames_por_ciclo = 300
total_frames = int(ciclos_sistema * frames_por_ciclo)
# A vida humana dura exatamente UM ciclo (do 1, volta para o 1 e para).
frame_morte_humana = frames_por_ciclo 

def init():
    sistema_point.set_data([], [])
    sistema_trail.set_data([], [])
    humano_point.set_data([], [])
    humano_trail.set_data([], [])
    status_text.set_text('')
    return sistema_point, sistema_trail, humano_point, humano_trail, status_text

def update(frame):
    # O tempo avança linearmente
    theta = (frame / frames_por_ciclo) * 2 * np.pi
    
    # --- ATUALIZAÇÃO DO SISTEMA (O Eterno) ---
    z_sistema = np.exp(1j * theta) # Gira para sempre
    sistema_point.set_data([z_sistema.real], [z_sistema.imag])
    
    # Rastro do sistema (últimos 100 frames para não poluir)
    history_start = max(0, frame - 100)
    theta_history = np.linspace((history_start/frames_por_ciclo)*2*np.pi, theta, frame-history_start+1)
    z_history = np.exp(1j * theta_history)
    sistema_trail.set_data(z_history.real, z_history.imag)
    
    # --- ATUALIZAÇÃO DA VIDA HUMANA (O Finito) ---
    
    if frame <= frame_morte_humana:
        # ESTÁ VIVO: A vida humana é a SOMBRA (projeção real) do sistema girando.
        # Ele só se move no Eixo X (Real). O Y é sempre 0.
        x_humano = z_sistema.real 
        y_humano = 0
        
        humano_point.set_data([x_humano], [y_humano])
        humano_point.set_alpha(1.0)
        
        # Rastro da vida (histórico completo da linha reta)
        theta_humano_hist = np.linspace(0, theta, frame+1)
        x_humano_hist = np.cos(theta_humano_hist)
        y_humano_hist = np.zeros_like(x_humano_hist)
        humano_trail.set_data(x_humano_hist, y_humano_hist)
        
        estado_humano = "VIVO (Percorrendo a Linha Real)"
        
    else:
        # ESTÁ MORTO: O ciclo humano acabou. O ponto congela e desaparece.
        # Congela na posição final (x=1, y=0)
        humano_point.set_data([1], [0])
        # Faz o ponto desaparecer lentamente (fade out)
        alpha_fade = max(0, 1.0 - (frame - frame_morte_humana) / 100)
        humano_point.set_alpha(alpha_fade)
        humano_trail.set_alpha(alpha_fade * 0.5)
        
        estado_humano = "FIM DO CICLO (Integração ao Zero/Memória)"

    # Texto de status
    progresso_vida = min(100, (frame / frame_morte_humana) * 100)
    status_text.set_text(f'Progresso da Vida Humana: {progresso_vida:.1f}%\nEstado: {estado_humano}\n\nO Sistema Vermelho continua girando...')

    return sistema_point, sistema_trail, humano_point, humano_trail, status_text

# Criando a animação (interval=20 para ser fluida)
ani = FuncAnimation(fig, update, frames=total_frames+100, init_func=init, blit=True, interval=20, repeat=False)

plt.show()

print("Gerando GIF... (Isso pode levar uns segundos)")
ani.save('vida_vs_sistema.gif', writer='pillow', fps=30)
print("GIF salvo com sucesso na pasta do projeto!")
import time

class VortexSecurity:
    """
    Sistema de Controle de Acesso Baseado em Bitwise (Zeros à Direita).
    Isso é o que roda por trás de grandes sistemas para ser rápido e seguro.
    """
    
    # --- DEFINIÇÃO DOS PODERES (A MÁGICA DO SHIFT) ---
    # 1 (0001) -> Leitura Básica
    # 2 (0010) -> Gravação (Criar/Editar)
    # 4 (0100) -> Deletar (Poder destrutivo)
    # 8 (1000) -> Admin (Poder total)
    
    PERMISSAO_LER     = 1  # 1 << 0
    PERMISSAO_GRAVAR  = 2  # 1 << 1
    PERMISSAO_DELETAR = 4  # 1 << 2
    PERMISSAO_ADMIN   = 8  # 1 << 3

    def __init__(self, nome_usuario):
        self.nome = nome_usuario
        self.permissoes_tatuadas = 0 # Começa "Zerado" (Sem permissão nenhuma)

    def conceder_poder(self, poder, nome_do_poder):
        print(f"[SISTEMA] Concedendo poder de '{nome_do_poder}' para {self.nome}...")
        # O Operador '|=' (OU Bit a Bit) soma o poder sem duplicar
        self.permissoes_tatuadas |= poder
        time.sleep(0.5) # Um charme visual
        self._mostrar_bits()

    def revogar_poder(self, poder):
        print(f"[SISTEMA] Revogando poder de {self.nome}...")
        # O Operador '&=' com '~' remove exatamente aquele bit
        self.permissoes_tatuadas &= ~poder
        self._mostrar_bits()

    def tentar_acessar(self, poder_necessario, acao_descricao):
        print(f"\n> {self.nome} está tentando: {acao_descricao}...")
        time.sleep(1)
        
        # O Operador '&' verifica se o bit específico está ligado
        if (self.permissoes_tatuadas & poder_necessario) == poder_necessario:
            print(f"  ✅ SUCESSO! Acesso PERMITIDO. (O bit {bin(poder_necessario)} bateu)")
            return True
        else:
            print(f"  🚫 ERRO! Acesso NEGADO. Faltam zeros à direita.")
            return False

    def _mostrar_bits(self):
        # Mostra como o computador vê o usuário por dentro (em binário)
        print(f"  [STATUS ATUAL] Valor Inteiro: {self.permissoes_tatuadas} | Binário: {bin(self.permissoes_tatuadas)}")

# --- SIMULAÇÃO DO QUE ACONTECE NO MUNDO REAL ---

def rodar_demo():
    print("=== INICIANDO VORTEX SECURITY KERNEL ===\n")
    
    # 1. Nasce um funcionário novo (Estagiário)
    estagiario = VortexSecurity("Estagiário João")
    
    # 2. Ele tenta acessar o Banco de Dados Financeiro (Precisa ser Admin)
    estagiario.tentar_acessar(VortexSecurity.PERMISSAO_ADMIN, "Ver Salários dos Sócios")
    
    print("\n--- O Chefe chegou e deu permissão básica ---")
    # 3. Damos permissão apenas de LER
    estagiario.conceder_poder(VortexSecurity.PERMISSAO_LER, "LEITURA")
    
    estagiario.tentar_acessar(VortexSecurity.PERMISSAO_LER, "Ler Relatório Diário")
    estagiario.tentar_acessar(VortexSecurity.PERMISSAO_GRAVAR, "Alterar Relatório Diário") # Vai falhar

    print("\n--- Promoção! João agora é Editor ---")
    # 4. Adicionamos o poder de GRAVAR (O Zero à direita atuando: 1 vira 3)
    estagiario.conceder_poder(VortexSecurity.PERMISSAO_GRAVAR, "GRAVAÇÃO")
    
    estagiario.tentar_acessar(VortexSecurity.PERMISSAO_GRAVAR, "Alterar Relatório Diário")
    
    print("\n--- FIM DA DEMO ---")

if __name__ == "__main__":
    rodar_demo()
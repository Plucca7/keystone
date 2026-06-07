# Pilar de Segurança — regra detalhada

> **O que é:** a regra por extenso do pilar de Segurança do Keystone. Sai do esqueleto
> ([pilares.md](pilares.md)) pra regra acionável. Nível **essencial** (o que todo projeto nasce
> tendo); o reforçado entra quando o projeto é sensível.
>
> **Status:** primeira redação 2026-06-07. Baseada nas referências escolhidas por relevância
> (ver fim do documento). Itens marcados com 🔧 têm conferente automático que roda sozinho.

---

## Princípio

Segurança **em código, não em agente**: roda sozinha, custo zero, sem depender de IA paga. Duas
frentes, pesos diferentes:

- **Tranca por dentro** (coração) — o que está 100% nas nossas mãos e onde mais se erra.
- **Muro e portaria** (borda) — barrar abuso; boa parte se liga pronta.

A IA, quando entra (caça mais funda), é a do assistente que o dev já usa — opcional e desligada por
padrão.

## Como o projeto nasce seguro — as 3 camadas (custo zero)

1. **Regras escritas** — este documento.
2. **Conferentes automáticos** 🔧 — leem o código e as dependências e **travam na máquina do dev E
   de novo antes de publicar** (rede dupla). Determinísticos, sem IA.
3. **Configuração de proteção** — vem pré-ajustada e ligada.

---

## Frente 1 — A tranca por dentro (essencial)

### 1.1 Cada cliente só vê o que é dele
A regra mais importante de todas em sistema com vários clientes.
- Toda informação carrega a **etiqueta do dono**.
- Toda busca no banco **filtra pela etiqueta automaticamente** — a proteção mora **no banco**, não só
  no código de tela (que pode ter brecha). Nunca confiar só na aplicação.
- Usuário sem dono definido é **bloqueado**, nunca "vê tudo".
- 🔧 Conferente aponta busca ao banco sem o filtro de dono.

### 1.2 Login firme
- Senha forte exigida; senha **guardada cifrada**, jamais em texto puro.
- **Trava após várias tentativas erradas** (barra ataque de adivinhação em massa).
- Sessão **expira** sozinha; sair encerra de verdade.
- **Segundo fator** disponível, e exigido no nível reforçado.

### 1.3 Senha e segredos guardados
- Chaves e segredos **nunca no código nem no repositório** — ficam fora, no ambiente, guardados com
  segurança e reusáveis (conecta com "segredos fora do código" do pilar Colocar no ar).
- 🔧 Conferente **recusa subir** qualquer código com segredo exposto.

### 1.4 Só faz quem pode
- Toda ação confere se o usuário **tem direito** àquela ação.
- **Negar por padrão**: só é permitido o que foi liberado explicitamente.
- Usuário comum **não consegue** fazer coisa de administrador (sem brecha de "subir de cargo").

### 1.5 Nunca confiar no que chega
- Tudo que entra (pela tela, por outro sistema) é **tratado como suspeito** e validado.
- Proteção contra os ataques clássicos: comando malicioso enfiado num campo, script malicioso que
  roda na tela de outro usuário.
- 🔧 Conferente sinaliza os padrões perigosos no código.

### 1.6 Peças de terceiros vigiadas
- A lista de peças de terceiros é **conferida**; avisa quando uma tem **falha conhecida**.
- Não usar peça abandonada (sem manutenção).
- 🔧 Conferente automático sobre a lista de dependências.

### 1.7 Erro não entrega pista
- Mensagem de erro pro usuário é **discreta** — não revela caminhos, versões, nem dados internos.
- O detalhe vai pro **registro interno**, não pra tela.

### 1.8 Rastro do que aconteceu
- As ações importantes deixam **registro de quem fez o quê e quando**.
- O registro **não guarda dado sensível** (senha, cartão).
- Serve pra auditar e investigar depois (conecta com os carimbos do pilar Banco).

### 1.9 Nasce já ajustado
- Nenhuma porta aberta no "padrão de fábrica".
- Conexão **sempre cifrada** (o cadeado), nunca aberta.
- Proteções de navegador ligadas por padrão.

---

## Frente 2 — O muro e a portaria (borda)

- **Barra excesso de acesso**: segura quem martela o sistema pra atrapalhar ou sobrecarregar.
- **Barra abuso automatizado**: dificulta robôs de força bruta.
- **Ligado de fábrica**; quem não quiser, desliga.

---

## Os níveis

| Nível | Quando | O que muda |
|-------|--------|------------|
| **Essencial** | Todo projeto, desde o nascimento | Itens 1.1 a 1.9 + a borda básica |
| **Reforçado** | Projeto sensível (dado pessoal, dinheiro, saúde, jurídico) | Segundo fator obrigatório, cifragem extra, registro mais rígido, revisão humana de mudanças sensíveis |

O nível é **deduzido** da pergunta de sensibilidade do wizard ([wizard-inicial.md](wizard-inicial.md)).

## A camada de IA (opcional, a do dev)

Caça mais funda de brechas, feita pelo assistente que o dev já usa pra programar — **nunca uma
camada paga da plataforma**. Desligada por padrão; o projeto fica seguro sem ela.

---

## Referências (escolhidas por relevância ao nosso mundo)

- **OWASP ASVS** — padrão de verificação (base dos itens 1.1–1.9). Mapeamento: 1.1/1.4 → controle de
  acesso; 1.2 → autenticação; 1.5 → validação; 1.7/1.8 → erros e registro; 1.9 → configuração.
- **OWASP Cheat Sheet Series** — o "como fazer" de cada item.
- **OWASP Web Security Testing Guide** — como testar.
- Conferentes automáticos: análise de padrões perigosos no código + verificação da lista de
  dependências. Borda: barra-excesso pré-ajustado.

> Nota: cada item deve ser confirmado contra a versão atual do ASVS na fase de implementação.

# Os 8 Pilares da Plataforma

> **O que é este documento:** o esqueleto (blueprint) da skill genérica de criação de projetos
> da LZR — o produto que define o que TODO projeto novo já nasce tendo. Padrão internacional,
> sem marca, pensado pra comunidade; a LZR é só a casa.
>
> **Status:** esqueleto fechado em 2026-06-07 (sessão com Paulo). A redação por extenso de cada
> pilar ainda está pendente — começa pela Segurança. Este arquivo é a bússola até lá.

---

## Princípio que costura tudo (o DNA)

**Vem de série, roda sozinho, custo zero — e a inteligência artificial é só uma camada opcional por cima.**

Nenhum pilar depende de IA pra funcionar. O desenvolvedor recebe a coisa montada e ela trabalha
de graça (conferentes automáticos determinísticos, regras escritas, configuração pronta). A IA fica
como reforço opcional. E quando entra, é sempre a do **assistente que o dev já usa pra programar** —
nunca uma camada paga da plataforma. Um projeto fica seguro, testado e bem-feito mesmo sem usar
IA nenhuma. Ver [alma-skill.md](alma-skill.md).

Esse princípio nasceu da leitura crítica da referência da Anthropic
(`defending-code-reference-harness`): lá a caça à falha é feita por um agente de IA que custa a cada
rodada. Nós invertemos — o valor vira engenharia que roda sozinha; a IA é o topo do bolo, não a base.

---

## Regras detalhadas por pilar

Cada pilar tem sua regra por extenso:

1. [Fundação](fundacao.md)
2. [Qualidade de código](qualidade-codigo.md)
3. [Banco de dados](banco-dados.md)
4. [Testes](testes.md)
5. [Fluxo de trabalho](fluxo-trabalho.md)
6. [Colocar no ar](colocar-no-ar.md)
7. [Segurança](seguranca.md)
8. [Documentação](documentacao.md)

## Os 8 pilares e suas decisões fechadas

### 1. Fundação

- Mesma organização interna em todo projeto (mesmo lugar pra cada coisa).
- Acessível de série (usável por pessoas com deficiência — visão, audição, só teclado).
- Datas, dinheiro e números no formato do país do usuário, automático.
- Idioma de partida e prioridade de tela (celular / computador / ambos) **sempre perguntados** no
  briefing inicial — nunca assumidos.
- (Já decidido antes) Responsividade é fundação, sempre. Identidade visual (cor, fonte, accent) é do
  projeto/cliente, não da plataforma.

### 2. Qualidade de código

- Formatação única que se arruma sozinha ao salvar (sem decisão manual de estilo).
- Qualquer erro ou aviso **barra a subida** — regra de "zero erro, zero aviso".
- Aviso automático quando arquivo/trecho cresceu demais (força quebrar em pedaços).
- Comentário só onde não é óbvio: explica o "porquê" (decisão, regra de negócio), nunca o trivial.

### 3. Banco de dados

- Carimbo automático de criação e de última alteração em toda informação.
- Apagar = esconder e poder recuperar (nunca some de verdade) — exclusão reversível.
- Toda mudança de estrutura por passos registrados e repetíveis; ninguém mexe direto.
- Identificação embaralhada e impossível de adivinhar (não sequencial 1, 2, 3).
- (Já decidido antes) Nomes internos sempre em inglês. Toda informação carrega a etiqueta do dono
  (separação de clientes) — ver Pilar 7.

### 4. Testes

- Teste nasce junto com a funcionalidade, desde o dia 1 (a suíte cresce com o projeto).
- Cobre o caminho que dá certo **e** o que dá errado (dado inválido, abuso, sem permissão).
- Teste falhando **barra a subida**.
- Mede por foco no crítico (dinheiro, login, dado de cliente), não por percentual de cobertura.

### 5. Fluxo de trabalho

- Três níveis: oficial → preparação → trabalho do dia, com teste a cada entrega.
- Toda mudança passa por uma porta de revisão antes de entrar no oficial.
- Quadro de tarefas (a fazer / fazendo / feito) montado de série.
- Passagem de bastão entre sessões de série: diário do que foi feito + briefing pra retomar.
- Cada entrega registra o autor (pessoa ou agente de IA).

### 6. Colocar no ar

- Sobe sozinho depois que passa nos freios (testes + conferentes).
- Palco de ensaio (cópia idêntica) antes do ar real.
- Volta atrás rápido (desfaz num gesto) se algo quebrar no ar.
- Segredos e chaves de cada ambiente sempre fora do código.

### 7. Segurança

> Regra detalhada por extenso em [seguranca.md](seguranca.md).

- **Segurança em código, não em agente** — roda sozinha, custo zero; IA opcional por cima.
- **Duas frentes, pesos diferentes:**
  - _Tranca por dentro_ (coração) — cada cliente só vê o que é dele, login firme, permissões certas,
    nunca confiar no que chega, segredos guardados. É onde mais se erra e está 100% nas nossas mãos.
  - _Muro e portaria_ (frente menor) — barrar abuso / excesso de acesso na borda. Boa parte se liga
    pronta.
- **Decisões fechadas:**
  - Essencial no nascimento; reforça conforme o projeto cresce.
  - Conferentes automáticos travam na máquina do dev **e** de novo antes de ir pro ar (rede dupla).
  - Proteção contra abuso (borda) ligada de fábrica; quem não quer, desliga.
  - Caça à falha por IA: encaixe pronto, **desligado** — custo zero até alguém ligar.

### 8. Documentação

- Toda decisão importante de arquitetura vira registro permanente curto (o "porquê").
- Documentação de como o sistema funciona se gera do próprio código sempre que possível.
- Nasce junto com o projeto, no calor da hora — não no fim.
- Porta de entrada pra outros sistemas tem manual claro de uso.
- (Já decidido antes) Documentação técnica em inglês; front no idioma do produto.

---

## A costura entre os pilares (não são caixas soltas)

- A _separação de clientes_ (Segurança) mora no cofre do _Banco_ (etiqueta de dono + identificação
  embaralhada).
- O _"barra sempre"_ da _Qualidade_ só tem dente por causa dos _Testes_.
- O _"sobe sozinho"_ do _Ar_ só é seguro por causa dos freios da _Qualidade_ e dos _Testes_.
- A _passagem de bastão_ do _Fluxo_ é o que permite retomar uma sessão sem perder contexto.
- Os _conferentes automáticos_ aparecem em três pilares (Qualidade, Testes, Segurança) — mesma ideia,
  custo zero, rodando sozinho.

---

## Fases de construção — começam pela Segurança

| Fase                         | Entrega                                                                                                                                 | Custo de IA |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **1 — Regras + conferentes** | Regras escritas do pilar + conferentes automáticos embutidos no projeto-modelo, travando código com brecha (na máquina e na publicação) | Zero        |
| **2 — Proteção de frente**   | Barra-abuso da borda pré-ajustado e ligado de fábrica                                                                                   | Zero        |
| **3 — Boneco de testes**     | Alvo propositalmente cheio de brechas pra provar que o pilar pega as falhas                                                             | Zero        |
| **4 — (opcional, futuro)**   | Encaixe da caça à falha com IA, desligado por padrão                                                                                    | Só se ligar |

---

## Referências que embasam o pilar de Segurança (escolhidas por relevância ao nosso mundo)

Frente "tranca por dentro" — guias do que precisa existir:

- OWASP ASVS — padrão de verificação de segurança de aplicação (base nº 1)
- OWASP Cheat Sheet Series — como fazer cada coisa do jeito seguro
- OWASP Web Security Testing Guide — como testar a segurança

Frente "tranca por dentro" — encontrar a brecha sozinho (sem IA):

- Semgrep — aponta padrões perigosos no nosso código automaticamente
- OWASP Dependency-Check — avisa quando uma peça de terceiro tem falha conhecida

Frente "muro e portaria":

- express-rate-limit — referência madura de barrar excesso de acesso

Validação (futuro):

- OWASP Juice Shop — site cheio de brechas de propósito, pra provar que o pilar funciona

Inspiração de IA (camada opcional, futuro): `anthropics/defending-code-reference-harness`.

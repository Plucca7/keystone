# Wizard inicial da skill de criação de projetos

> **O que é:** o roteiro de perguntas e o comportamento da skill **antes e durante** a criação do
> projeto. Coleta só o que é do gosto do usuário; deduz o que dá pra deduzir; e já vem pronto com
> tudo que é decisão da plataforma. Ver [pilares.md](pilares.md).
>
> **Status:** roteiro e comportamento aprovados em 2026-06-07. Vira código da skill numa fase seguinte.

---

## Três tipos de decisão (a regra de ouro)

1. **Decisão da plataforma** (fixa, nós já tomamos) → vem pronta, NÃO é perguntada nem deduzida.
   Ex: barra erro antes de subir, teste nasce junto, nada some do banco.
2. **Decisão deduzida** (a skill infere do que o usuário já disse) → NÃO é perguntada.
   Ex: **precisa de banco?** — deduzido do tipo de projeto + sensibilidade.
3. **Decisão do projeto** (do gosto do usuário, só ele sabe) → vira pergunta.
   Ex: nome, idioma, prioridade de tela, a cara.

> Princípio: só perguntar o tipo 3. Quanto mais a skill deduz (tipo 2), menos cansa o usuário.

---

## Rodada A — Briefing de produto (o wizard mínimo)

Mínimo essencial. 6 perguntas; a 5ª é opcional e ramifica.

### 1. Nome do projeto · _resposta livre_

### 2. Tipo de projeto · _escolha uma_

- Site / página (vitrine, institucional)
- Sistema com login e dados (painel, área logada)
- Serviço que conversa com outros sistemas (a "porta de entrada")
- Aplicativo de celular

### 3. Idioma de partida · _pt · en · es · outro_

### 4. Prioridade de tela · _celular · computador · os dois_

### 5. A cara do projeto · _escolha um caminho_

- **Nossa skill de design cria** (padrão) → aciona o **briefing fundo** (abaixo) → identidade sob medida, sem visual genérico de IA
- **Importar a minha** → usuário traz identidade pronta (marca existente, design feito fora); a skill aplica
- **Decidir depois** → começa com visual padrão neutro

### 6. Lida com dado sensível ou dinheiro? · _sim · não_ → alimenta a dedução de segurança e de banco

---

## Briefing fundo (condicional — só no caminho "nossa skill de design cria")

Combustível da skill de design. NÃO roda se o usuário importa design ou decide depois.
Perguntas (uma de cada vez): propósito real · quem usa (nível/frequência/estado de espírito) ·
ação principal · diferencial · sensação desejada. Essas respostas viram o briefing entregue à
skill de design, que deriva paleta, tipografia, tom e densidade da essência do produto.

---

## Rodada B — Setup técnico (onde o projeto mora)

Perguntas do tipo 3 sobre infraestrutura:

- **Onde versionar** · _escolha um_ → GitHub · GitLab · só na máquina (sem nuvem)
- **Visibilidade** · _público · privado_
- **Pasta-mãe** · _onde, na máquina, a pasta do projeto será criada_

> A skill **cria a pasta do projeto sozinha** dentro da pasta-mãe (traz uma cópia do modelo oficial).
> O usuário não precisa criar pasta nenhuma antes nem rodar a skill de dentro dela.

---

## O que a skill DEDUZ sozinha (tipo 2 — não pergunta)

- **Necessidade de banco:** do tipo de projeto + sensibilidade (detalhe na seção abaixo).
  - A pergunta "vai ter banco?" NÃO existe — é dedução nossa, não escolha do usuário.
- **Nível de segurança:** essencial por padrão; sobe pra reforçado se a pergunta 6 = sensível.
- **Aplicação do design system:** a fundação visual (fontes, espaçamento, acessibilidade, formatação
  local) vem sempre pronta; só a personalidade (cor/fonte) é que segue o caminho da pergunta 5.

---

## Banco de dados — como a skill resolve

1. **Necessidade (deduzida, não perguntada):** do tipo de projeto + sensibilidade.
   - Site institucional → sem banco (nem toca no assunto).
   - Sistema com login / dados / sensível → precisa de banco.
2. **Serviço de banco:** um padrão nosso (de sempre), com opção de o usuário trocar por outro.
3. **Acesso ao serviço (conta + chave) — o ponto honesto:**
   - A skill **NÃO cria a conta** no serviço (cadastro/pagamento é pessoal do usuário).
   - **Primeira vez:** pede a chave de acesso **uma vez** e guarda com segurança no ambiente do
     usuário, **fora do código**. Se o usuário ainda não tem conta, cria a conta nesse momento.
   - **Próximos projetos:** reusa a chave guardada — não pergunta de novo.
4. **Criação do banco:** com a chave em mãos, a skill **cria o banco do projeto e conecta** sozinha.
   (Sem a chave: cria o projeto com o banco pendente e avisa o que falta — escolha do usuário.)
5. **Mudanças de estrutura (migrations):** sempre pela ferramenta oficial do serviço — sozinhas,
   sem IA, custo zero. Fiel ao DNA.
6. **Ponte de IA pro banco (atalho IA↔banco):** a skill **NÃO mexe** nela. Quem quiser o conforto de
   conversar com o banco pela IA ativa por conta própria.

---

## Caminhos da cara do projeto (resumo)

| Caminho                             | O que acontece                                               | Briefing fundo? |
| ----------------------------------- | ------------------------------------------------------------ | --------------- |
| Nossa skill de design cria (padrão) | Deriva identidade da essência; foge do visual genérico de IA | Sim             |
| Importar a minha                    | Usuário traz marca/design pronto; a skill aplica             | Não             |
| Decidir depois                      | Visual padrão neutro; personaliza mais tarde                 | Não             |

---

## Apresentação (genérica, fiel ao DNA)

- Dentro de um assistente de IA com cartões → perguntas viram cartões de múltipla escolha.
- Em outro ambiente → perguntas em texto simples.
- Mesmo conteúdo, duas roupas. Custo de IA só no ambiente de IA, e só na criação.

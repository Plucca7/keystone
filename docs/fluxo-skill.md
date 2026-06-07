# Fluxo de execução da skill — de ponta a ponta

> **O que é:** a sequência completa do que a skill faz, do comando inicial até a entrega do projeto.
> Junta todas as decisões em uma ordem executável. Ver [pilares.md](pilares.md) e
> [wizard-inicial.md](wizard-inicial.md).
>
> **Status:** desenho aprovado em 2026-06-07. Vira código da skill numa fase seguinte.

---

## Etapa 0 — Início
O usuário roda a skill de qualquer lugar. **Não precisa criar pasta nem repositório antes.**

## Etapa 1 — Rodada A: briefing de produto (wizard mínimo)
Perguntas, uma de cada vez:
1. Nome do projeto
2. Tipo de projeto
3. Idioma de partida
4. Prioridade de tela
5. A cara → **nossa skill de design** (aciona o briefing fundo) · **importar** · **decidir depois**
6. Lida com dado sensível ou dinheiro?

## Etapa 2 — Rodada B: setup técnico
- Onde versionar (com nuvem ou só na máquina)
- Visibilidade (público / privado)
- Pasta-mãe (onde, na máquina, criar a pasta do projeto)

## Etapa 3 — Deduções (a skill decide sozinha, não pergunta)
- **Precisa de banco?** — do tipo + sensibilidade
- **Nível de segurança** — essencial ou reforçado (se sensível)
- **Fundação visual** — fontes, espaçamento, acessibilidade, formatação local: sempre aplicadas

## Etapa 4 — Criação (a skill monta tudo)
1. **Cria a pasta** do projeto na pasta-mãe (cópia do modelo oficial).
2. **Cria o repositório** no serviço escolhido (ou só local).
3. **Três níveis de versionamento** (oficial / preparação / trabalho) + porta de revisão + proteção
   da oficial.
4. **Organização de série:** quadro de tarefas + passagem de bastão (diário + briefing).
5. **Banco (se deduzido):** reusa a chave guardada (ou pede uma vez na primeira) → cria o banco →
   conecta → estrutura de mudanças de estrutura registradas. Migrations pela ferramenta oficial,
   sem IA. (Sem chave: deixa o banco pendente e avisa.)
6. **Identidade visual:** caminho da pergunta 5 — skill de design (com o briefing fundo) / aplica o
   design importado / visual padrão neutro.
7. **Colocar no ar:** deixa a esteira de subida e o palco de ensaio prontos no projeto; a subida real
   e a hospedagem ficam pra quando o usuário definir onde hospedar.
8. **Conferentes automáticos** (qualidade, testes, segurança) instalados e ligados — travam na
   máquina e na publicação.
9. **Primeira gravação registrada** + sobe pro repositório (se houver nuvem).

## Etapa 5 — Confirmação final
Resumo do que foi criado: pasta local, repositório, banco (ou pendente), identidade visual, quadro
de tarefas, três níveis, conferentes ativos. Mais os próximos passos pro usuário.

---

## Princípios que o fluxo respeita
- **Só pergunta o tipo 3** (gosto do usuário); deduz o tipo 2; entrega pronto o tipo 1. Ver
  [wizard-inicial.md](wizard-inicial.md).
- **Roda sozinho, custo zero de IA.** A IA entra só onde é genuinamente útil (a skill de design, se
  escolhida) e nunca é obrigatória.
- **Segredos fora do código.** Chaves de serviços ficam guardadas no ambiente do usuário, reusáveis.
- **A skill não cria conta em serviço de terceiro** (banco, hospedagem) — isso é do usuário; a skill
  só usa a chave que ele forneceu uma vez.

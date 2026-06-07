# Plano de construção do Keystone

> **O que é:** o roteiro de como sair do desenho (os documentos desta pasta) pro código de verdade.
> Ver [pilares.md](pilares.md), [fluxo-skill.md](fluxo-skill.md), [alma-skill.md](alma-skill.md).
>
> **Status:** plano aprovado em 2026-06-07.

## Decisões de construção

- **Onde vive:** repositório pessoal de **Paulo de Lucca**, público (ele é o dono dos direitos).
  A criação do repositório exige a autorização/autenticação dele — agentes preparam, Paulo publica.
- **Estratégia:** construir **tudo completo antes de soltar** pro público. Mas **por dentro, em
  etapas verificáveis** — cada etapa testada antes da próxima, pra não construir no escuro. A
  abertura pública acontece só quando tudo passar.
- **Primeira peça:** o esqueleto que pergunta e cria.

## As etapas (em ordem)

### Etapa 1 — O esqueleto que pergunta e cria
O comando principal + o roteiro de perguntas (o wizard mínimo) + criar a pasta e a estrutura base do
projeto. É a espinha; todo o resto pendura nela. Ver [wizard-inicial.md](wizard-inicial.md).

### Etapa 2 — O modelo de projeto base
O molde que serve de ponto de partida, já com a organização padrão e o jeito local (datas, dinheiro,
idiomas, responsividade, acessibilidade). Ver [fundacao.md](fundacao.md).

### Etapa 3 — Os guardas automáticos
As peças que rodam sozinhas e travam: qualidade (formatar, barrar erro, tamanho), segurança (segredo
exposto, código perigoso, dependências com falha, separação de clientes), testes (roda e barra). Na
máquina e na publicação. Ver [qualidade-codigo.md](qualidade-codigo.md), [seguranca.md](seguranca.md),
[testes.md](testes.md).

### Etapa 4 — Os pilares concretizados no modelo
Banco (carimbos, esconder, identificação, separação), os três níveis de versionamento, quadro de
tarefas, passagem de bastão, e a esteira de colocar no ar (com ensaio e volta-atrás). Ver
[banco-dados.md](banco-dados.md), [fluxo-trabalho.md](fluxo-trabalho.md),
[colocar-no-ar.md](colocar-no-ar.md).

### Etapa 5 — O comando de análise
O comando que observa um projeto existente e entrega o relatório (distância, plano, custo/risco). Ver
[analyze-project.md](analyze-project.md).

### Etapa 6 — A casa do produto
A apresentação honesta, as regras de contribuição (a porta de revisão pra comunidade) e a licença,
no repositório. Ver [README.md](README.md), [LICENSE](LICENSE).

### Etapa 7 — A prova final
Criar projetos de verdade pra validar de ponta a ponta + o "boneco de testes" (um alvo cheio de
brechas de propósito) pra provar que os guardas de segurança realmente pegam as falhas.

## Regra de cada etapa
Construída na área de trabalho, **testada**, e só então a próxima. A bateria de conferência cresce a
cada etapa. A abertura pública só acontece depois da Etapa 7 passar inteira.

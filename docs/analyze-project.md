# O comando de análise de projeto existente

> **O que é:** o desenho do comando irmão do criador — pega um projeto que **já existe e está vivo**,
> mede contra os 8 pilares e entrega um relatório com a distância, o plano e o custo/risco. Faz parte
> da família Keystone. Ver [alma-skill.md](alma-skill.md) e [pilares.md](pilares.md).
>
> **Status:** desenho aprovado em 2026-06-07. Embrião: a ferramenta de auditoria atual. Vira código
> numa fase seguinte.

---

## Princípio
Todo bom padrão precisa de duas coisas: **nascer certo** (o criador) e **medir/consertar o que já
existe** (este comando). Ele **só observa e reporta** — não mexe em nada. A atualização de fato é uma
decisão separada do dono, depois.

## O que ele faz e o que NÃO faz

| Faz | Não faz |
|-----|---------|
| Observa o projeto (só lê, não executa) | Não roda o projeto nem os testes |
| Passa os guardas automáticos por cima | Não altera nenhum arquivo |
| Compara contra os 8 pilares | Não cria conta em serviço nenhum |
| Entrega um relatório | Não decide nada pelo dono |

## Como funciona

1. Você **aponta o comando pra um projeto que já existe**.
2. Ele **observa** (só lê) e roda os **guardas automáticos** — a parte mecânica, de graça.
3. **Compara contra os 8 pilares**: o que está dentro, o que está fora.
4. Entrega o **relatório em três partes** (abaixo).
5. Para por aí. Nada é alterado.

## O relatório (três partes)

### 1. Onde está hoje × o padrão
Pilar por pilar (os 8), o que já cumpre e o que falta. A **distância pro padrão**, clara.

### 2. Plano de atualização — **priorizado**
O que fazer pra chegar lá, **na ordem certa**: o mais crítico e de maior retorno primeiro
(segurança e separação de clientes na frente; capricho estético depois).

### 3. Custo e risco de cada item
- **Esforço** em escala simples: **pequeno / médio / grande** (sem fingir precisão de horas).
- **Risco** de mexer: **baixo / médio / alto** (mudança que pode quebrar coisa em volta pesa mais).

## A inteligência — quem faz o quê

- **Os guardas automáticos** apontam o gap mecânico (código fora do padrão, segredo exposto,
  dependência com falha, busca sem filtro de dono) — **de graça, sem IA**.
- **O assistente que o dev já usa** faz o julgamento que exige cabeça: gravidade, o plano de
  atualização, a estimativa de risco. **Nunca uma camada paga da plataforma** — ver
  [alma-skill.md](alma-skill.md).

## Conexões
- Mede contra os mesmos [8 pilares](pilares.md) que o criador aplica.
- A separação de clientes e os segredos expostos (os achados mais graves) vêm da
  [Segurança](seguranca.md).
- A atualização, quando o dono decidir fazer, segue o [Fluxo de trabalho](fluxo-trabalho.md)
  (porta de revisão, testes a cada passo).

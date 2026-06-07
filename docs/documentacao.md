# Pilar de Documentação — regra detalhada

> Regra por extenso do pilar de Documentação do Keystone. Esqueleto em [pilares.md](pilares.md).
> 🔧 = guarda automático.

## Princípio
A documentação nasce junto com o projeto, no calor da hora, e se mantém viva sem virar mentira.
Guarda o "porquê" das decisões, não só o "o quê".

## 1. Decisões viram registro permanente
- Toda decisão importante de arquitetura vira um **registro curto**: o que foi decidido e **por quê**.
- Daqui a um ano alguém entende o motivo, sem refazer a mesma discussão.

## 2. Documentação gerada do código
- A documentação de como o sistema funciona por dentro se **gera do próprio código** sempre que
  possível. Acompanha o código e não envelhece mentindo.

## 3. Nasce junto com o projeto
- Escrita **enquanto se constrói**, não no fim. O projeto nasce com a apresentação (o "pra que serve")
  e ganha registros conforme decisões são tomadas.

## 4. Porta de entrada com manual
- Se o sistema tem uma porta de entrada pra outros sistemas conversarem com ele, essa porta tem um
  **manual claro** de como usar — quem integra não precisa adivinhar.

## 5. Idioma da documentação
- Documentação **técnica em inglês** (a apresentação do projeto, registros de decisão, manuais da
  porta de entrada, comentários de código) — padrão internacional.
- O texto que o usuário final lê na tela fica **no idioma do produto**.

## 6. A apresentação é honesta
- A apresentação do projeto descreve o que ele **faz de verdade**, o que cobre e onde ainda não
  chegou. Sem promessa vazia. Ver o exemplo em [README.md](README.md).

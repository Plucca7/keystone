# Pilar de Testes — regra detalhada

> Regra por extenso do pilar de Testes do Keystone. Esqueleto em [pilares.md](pilares.md).
> Nível essencial. 🔧 = guarda automático.

## Princípio

A rede de proteção que dá dente a tudo: sem testes, o "barra sempre" da Qualidade e o "sobe sozinho"
do Ar não teriam como existir. É o nosso verificador adversário — de graça.

## 1. Teste nasce junto da entrega

- Toda funcionalidade nova **vem com o seu teste**, desde o dia 1. A rede cresce com o projeto.
- Nada de "testa depois" (que vira "depois nunca").

## 2. Cobre o que dá certo E o que dá errado

- Testa o uso normal **e** as situações ruins: dado inválido, abuso, sem permissão, limites.
- É aqui que mora a robustez e a segurança (conecta com "nunca confiar no que chega").

## 3. Falhou, não sobe

- Teste vermelho **barra a subida**, automaticamente. A rede tem dente.
- 🔧 Guarda roda a suíte na máquina e antes de publicar.

## 4. Foco no que importa, não em número

- Cobre bem o **crítico** (dinheiro, entrada no sistema, dado de cliente) sem perseguir percentual.
- Qualidade sobre quantidade — nada de teste inútil só pra bater meta.

## 5. Testes confiáveis

- Testes **estáveis** (sem falha aleatória) e **independentes** (a ordem não importa).
- Teste instável é tratado como bug, não ignorado.

## Referências

Guias de teste consagrados + os guardas que rodam a suíte. A suíte cresce a cada entrega.

# Pilar de Qualidade de código — regra detalhada

> Regra por extenso do pilar de Qualidade de código do Keystone. Esqueleto em
> [pilares.md](pilares.md). Nível essencial. 🔧 = tem guarda automático.

## Princípio
A máquina cuida do chato (formatar, conferir, barrar) pra a pessoa cuidar do que importa. Tudo roda
sozinho, custo zero.

## 1. Formatação que se arruma sozinha
- Um padrão único de aparência, aplicado **automaticamente ao salvar**.
- Ninguém decide nem discute estilo — a máquina ajeita.
- 🔧 Guarda garante o formato único.

## 2. Barra qualquer erro ou aviso antes de subir
- Regra de **zero erro, zero aviso**: nada problemático sobe.
- Vale pra erro de código, aviso, lixo esquecido (trechos comentados, marcas de teste).
- 🔧 Guarda trava na máquina do dev **e** antes de publicar.

## 3. Avisa quando algo cresceu demais
- Arquivo ou trecho que ficou grande e difícil de entender **dispara um aviso** pra quebrar em
  pedaços, antes de virar bola de neve.
- 🔧 Guarda mede tamanho e complexidade.

## 4. Comenta o "porquê", não o óbvio
- Comentário onde a lógica **não é auto-explicativa**: decisão de arquitetura, trade-off, regra de
  negócio, contorno de limitação.
- Não comentar o trivial (o nome da variável já explica).

## 5. Nomes claros e código que se lê
- Nomes descritivos; funções curtas e com uma responsabilidade.
- Código que se entende sem precisar de comentário pro óbvio (o comentário fica pro "porquê").

## Referências
Guias de estilo consagrados + os guardas automáticos de formatação e conferência. A suíte de
conferência cresce com o projeto.

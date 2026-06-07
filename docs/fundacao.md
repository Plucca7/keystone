# Pilar de Fundação — regra detalhada

> Regra por extenso do pilar de Fundação do Keystone. Esqueleto em [pilares.md](pilares.md).
> Nível essencial. 🔧 = tem guarda automático.

## Princípio
A base sobre a qual tudo se ergue. Vem pronta e idêntica em todo projeto, pra ninguém reaprender
onde as coisas ficam. Decisões da plataforma (fixas) e o que é perguntado ao usuário no início.

## 1. Mesma organização em todo projeto
- A estrutura interna (onde mora cada tipo de coisa) é **a mesma em todo projeto Keystone**.
- Quem abre qualquer projeto já sabe se localizar.
- 🔧 Guarda confere que a estrutura esperada existe.

## 2. Acessível de série
- Usável por pessoas com deficiência (enxergar, ouvir, navegar só com teclado) **desde o dia 1**.
- Contraste, textos alternativos, foco visível, alvos de toque grandes — padrão, não opção.
- 🔧 Guarda aponta os erros de acessibilidade mais comuns.

## 3. Formato local automático
- Datas, dinheiro, números, documentos e telefone aparecem **no jeito do país do usuário**,
  automaticamente — sem o dev formatar à mão.

## 4. Idiomas desde o nascimento
- A central de tradução nasce montada; o projeto tem um **idioma de partida** (perguntado no início)
  e está pronto pra ganhar outros sem retrabalho.
- Nada de texto fixo "chumbado" na tela — tudo passa pela central.

## 5. Responsividade é fundação
- Funciona bem em qualquer tela **sempre**. A escolha é só a **prioridade** (celular / computador /
  ambos), perguntada no início.

## 6. Identidade visual é do projeto
- A fundação visual (fontes-base, espaçamento, ritmo) vem pronta; a **personalidade** (cor, fonte de
  marca) é de cada projeto — gerada pela skill de design, importada, ou padrão neutro.

## Perguntado ao usuário no início
Nome, tipo de projeto, idioma de partida, prioridade de tela, a cara. Ver
[wizard-inicial.md](wizard-inicial.md).

# Pilar de Banco de dados — regra detalhada

> Regra por extenso do pilar de Banco de dados do Keystone. Esqueleto em [pilares.md](pilares.md).
> Comportamento da skill quanto ao banco em [wizard-inicial.md](wizard-inicial.md). 🔧 = guarda automático.

## Princípio

O cofre onde tudo é guardado nasce organizado, rastreável e seguro por padrão. As mudanças de
estrutura são sempre registradas; nada se perde de verdade.

## 1. Carimbo em tudo

- Toda informação guardada nasce com **carimbo de quando foi criada e de quando foi alterada** pela
  última vez. Ajuda a auditar, ordenar e descobrir "quando isso mudou?".

## 2. Apagar é esconder, não sumir

- Quando algo é "apagado", ele **some da vista mas continua guardado** — dá pra recuperar e auditar.
- Protege contra erro humano e fraude. (Apagar de verdade é exceção rara e consciente.)

## 3. Mudança de estrutura sempre registrada

- Toda alteração na estrutura do banco é feita por **passos registrados e repetíveis**, idênticos em
  qualquer ambiente. Ninguém mexe direto na mão.
- Roda pela ferramenta oficial do serviço de banco — **sem IA, custo zero**.

## 4. Identificação embaralhada

- Cada informação tem um **código de identificação impossível de adivinhar** (não sequencial 1, 2,
  3). Ninguém consegue contar quantos você tem nem bisbilhotar pelos números.

## 5. Cada cliente carrega a etiqueta do dono

- Toda informação tem a **etiqueta do cliente dono**, e a separação é garantida no banco.
- É a base da "tranca por dentro" da Segurança — ver [seguranca.md](seguranca.md) item 1.1.
- 🔧 Guarda aponta busca sem o filtro de dono.

## 6. Nomes internos em inglês

- Os nomes internos das informações são sempre em **inglês** (padrão internacional). A tela continua
  no idioma do cliente; só o motor é em inglês.

## Necessidade de banco (deduzida)

A skill **deduz** se o projeto precisa de banco (tipo + sensibilidade) e cria/conecta sozinha. Não
pergunta. Ver [wizard-inicial.md](wizard-inicial.md).

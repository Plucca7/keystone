# Pilar de Colocar no ar — regra detalhada

> Regra por extenso do pilar de Colocar no ar do Keystone. Esqueleto em [pilares.md](pilares.md).
> 🔧 = guarda automático.

## Princípio
O destino final, onde os freios que a gente montou (testes, guardas) provam seu valor. Sobe sozinho
porque é seguro — não apesar de ser.

## 1. Sobe sozinho depois dos freios
- Aprovou e **passou em tudo** (testes, guardas, porta de revisão), vai pro ar **automático**.
- Rápido e sem erro humano — porque os freios já seguraram o que era ruim.
- 🔧 A subida só dispara com tudo verde.

## 2. Palco de ensaio antes do ar real
- Toda mudança é vista funcionando numa **cópia idêntica** antes de o cliente ver. Pega surpresa
  antes de doer.

## 3. Volta atrás rápido
- Deu ruim no ar? **Desfaz num gesto** e volta à versão que funcionava. A rede de segurança do ar.

## 4. Segredos fora do código
- As chaves de cada ambiente (ensaio, ar real) ficam **fora do código**, guardadas com segurança.
  Cada ambiente tem as suas. Conecta com [seguranca.md](seguranca.md) item 1.3.
- 🔧 Guarda recusa subir código com segredo exposto.

## 5. A hospedagem é escolha do usuário
- A esteira de subida e o ensaio nascem **prontos no projeto**; a subida real e o serviço de
  hospedagem ficam pra quando o usuário definir onde hospedar (não na criação).
- A skill **não cria conta** no serviço de hospedagem — usa a chave que o usuário fornece uma vez.

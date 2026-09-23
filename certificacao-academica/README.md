# Certificação Acadêmica em Blockchain

Registro e verificação de certificados acadêmicos usando uma blockchain local
(Hardhat), com controle de quem pode emitir/revogar certificados.

## Dados na blockchain

- Hash do documento do certificado (`bytes32`) — não o PDF em si
- Endereço da instituição/coordenação que emitiu
- Endereço do aluno (identificador, sem dado pessoal)
- Curso e data de emissão
- Status (válido/revogado)

Dados pessoais (nome do aluno, o PDF completo) ficam **fora** da blockchain;
o hash é o elo entre o documento real e o registro on-chain.

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir a blockchain local

Em um terminal, deixe rodando:

```bash
npm run node
```

Isso sobe um node Hardhat em `http://127.0.0.1:8545` com 20 contas de teste
pré-financiadas (guarde as chaves privadas mostradas no terminal — a
`Account #0` será a "instituição").

### 3. Compilar e testar o contrato

Em outro terminal:

```bash
npm run compile
npm run test
```

Os testes cobrem: emissão válida, emissão por endereço não autorizado
(deve reverter), hash duplicado (deve reverter), revogação válida e
revogação por endereço sem permissão (deve reverter).

### 4. Implantar o contrato na rede local

```bash
npm run deploy
```

O endereço do contrato implantado será salvo em `deployed-address.json`
e impresso no terminal — copie para configurar a interface.

### 5. Rodar a interface

O passo 4 (`npm run deploy`) já atualiza automaticamente o arquivo
`frontend/config.js` com o endereço do contrato e o ABI — não precisa
copiar nada manualmente.

Como a interface faz chamadas via `fetch`/módulos, sirva a pasta `frontend`
com um servidor local simples (abrir o `index.html` direto com `file://`
pode não funcionar em todos os navegadores):

```bash
npx serve frontend
```

ou, alternativa com Python:

```bash
cd frontend
python3 -m http.server 5500
```

Depois acesse o endereço mostrado no terminal (ex: `http://localhost:5500`).

Na interface você pode:
- selecionar qual conta está "logada" (a Conta #0 é a instituição/owner)
- emitir um certificado (o texto digitado vira o hash armazenado on-chain)
- consultar por ID ou pelo mesmo texto usado na emissão
- revogar um certificado
- ver a lista de eventos (`CertificadoEmitido` / `CertificadoRevogado`) como
  visualização da "blockchain"
- autorizar novos emissores (apenas funciona com a Conta #0)

Para demonstrar a **rejeição de operação inválida**: selecione uma conta
diferente da #0 e tente emitir um certificado sem antes autorizá-la — a
interface vai mostrar o erro de reversão do contrato.

## Roteiro de demonstração (sugestão para os 10 minutos)

1. Mostrar `npm run node` rodando (blockchain local ativa)
2. Pela interface, emitir um certificado com uma conta autorizada
   → mostrar hash da transação confirmada
3. Consultar o certificado pelo id/hash → mostrar dados retornados
4. Tentar emitir um certificado usando uma conta **não autorizada**
   → mostrar a rejeição (revert) na interface
5. (opcional) Revogar um certificado e mostrar a mudança de estado (`valido: false`)

## Plano B (falha técnica)

Gravar um vídeo curto (2–3 min) da demonstração completa rodando localmente,
ou tirar prints de cada etapa (terminal do node, transação confirmada,
consulta, rejeição) para apresentar caso a demo ao vivo falhe.

## Próximos passos para a dupla

- [ ] Testar o fluxo completo ponta a ponta pela interface
- [ ] Escrever o relatório (problema, objetivos, justificativa, arquitetura,
      implementação, testes, limitações, conclusão)
- [ ] Gravar o vídeo/prints do plano B
- [ ] Ensaiar a apresentação dividindo os 10 minutos

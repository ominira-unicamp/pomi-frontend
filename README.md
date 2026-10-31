# POMI Frontend

SPA do POMI, o Planejador Ominira, com React, TanStack Router, Tailwind CSS e autenticação OpenID Connect pelo Keycloak.

## Desenvolvimento

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env`. O client `pomi-frontend` usa Authorization Code com PKCE S256; access e refresh tokens permanecem somente em memória.

Em desenvolvimento, `VITE_DATA_API_URL` aponta para `http://localhost:3000` e
`VITE_APP_API_URL` para `http://localhost:3001`. A primeira atende dados
acadêmicos públicos; a segunda atende recursos autenticados do estudante.

Com o servidor local ativo, `/_design-system` apresenta os tokens, variantes, estados e composições disponíveis. Essa rota renderiza a página de não encontrado em builds de produção.

## Design system

A interface segue três camadas:

1. `src/styles.css` contém os tokens semânticos dos temas claro e escuro. Cores de marca não devem ser repetidas nos componentes.
2. `src/components/ui` contém as primitivas Shadcn baseadas exclusivamente em Radix UI. Elas controlam comportamento acessível e variantes elementares.
3. `src/components` contém as composições do POMI, como shell, cabeçalho de página e estados de carregamento, vazio e erro. Rotas devem reutilizar essas composições em vez de reconstruir layouts.

O visual usa Outfit, vermelho POMI, superfícies de papel, contornos fortes e grafismos geométricos pontuais. Evite estilos inline, cores literais nas rotas, gradientes decorativos e agrupamentos excessivos em cards.

## Tema

O tema inicial segue `prefers-color-scheme`. A escolha entre claro, escuro e sistema é persistida no navegador com a chave `pomi-theme`.

## Verificação

```bash
npm run lint
npm run test
npm run build
```

O build executa Vite e TypeScript. A validação visual responsiva é feita em navegador real sobre o servidor local.

## Imagens de identidade

Avatares aparecem nos perfis, no menu da conta e nas listas e painéis de pessoas,
grupos, membros, convites, eventos e autoria de planejamentos. Os componentes de mídia usam as
variantes da App API e mostram iniciais quando não há imagem ou a leitura falha.

O menu da conta compartilha a consulta de perfil social com a edição. Fotos
privadas são lidas com Bearer, usam Blob URL temporária e são removidas da tela
na troca de sessão. As mutações de imagem invalidam as consultas de identidade
para atualizar as demais telas. A exibição não adiciona ampliação ao clicar.

## Perfil de pessoas

O perfil reúne avatar, nome, biografia e vínculo acadêmico no cabeçalho. Grupos
públicos e interesses aparecem em seções compactas, seguidos pela agenda e pelos
planejamentos autorizados. O menu Amigos oferece remoção com confirmação.

As participações formam uma lista vertical sem cards: nome e avatar de 40 px,
com cargos e períodos publicados em `positions`. Sem cargos, `joinedAt` fornece
a data de entrada; sem metadados, aparece somente a identidade do grupo. Papéis
e permissões de gestão não são usados. Interesses permanecem links vermelhos
para disciplinas filtradas pela tag. As divisórias usam contraste reduzido.

A agenda é delimitada por divisórias discretas e mantém a grade semanal existente,
com rolagem horizontal quando a largura disponível é menor que a grade.

A API atual não distingue agenda oculta de ausência de horários, por isso o
estado vazio informa apenas que não há horários compartilhados disponíveis.

### Edição de Meu perfil

A aba Informações reúne foto, nome e bio em Identidade pública, com Privacidade
na coluna lateral quando houver espaço e Interesses abaixo. O botão Salvar
alterações envia somente nome e bio; limites de 80 e 280 caracteres seguem o
contrato existente. Rascunhos sobrevivem às atualizações de foto, privacidade e
interesses, e a navegação avisa antes de descartar alterações pendentes.

A foto mantém seleção, prévia, cancelamento e envio separados. Privacidade usa
PATCHs independentes: o público das disciplinas salva ao selecionar e a
visibilidade do perfil mantém confirmação. As disciplinas incluem turmas,
horários e salas; curso, modalidade e ingresso seguem a visibilidade do perfil.
Interesses são adicionados ao selecionar uma sugestão e removidos pelo controle
do chip. O código público fica junto de Visualizar perfil no cabeçalho.

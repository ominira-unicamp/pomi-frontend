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

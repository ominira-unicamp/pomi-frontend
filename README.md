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

## SDK e builds independentes

O frontend usa a versão publicada `1.0.0-rc.5` de `@ominira/pomi-sdk`, fixada no
manifesto e no lockfile. `npm ci` e `npm run build` devem funcionar com apenas o
checkout do frontend, inclusive na Vercel. Não externalize o SDK no Rollup: ele
integra o bundle da aplicação.

Para desenvolver com o checkout vizinho do SDK, use um vínculo apenas local:

```bash
npm --prefix ../pomi-ts-sdk run build
npm install --no-save --package-lock=false ../pomi-ts-sdk
```

Esse comando não deve alterar `package.json` ou `package-lock.json`. Execute
`npm ci` para voltar ao pacote publicado. Os comandos `sdk:generate` e
`sdk:check` exigem os checkouts vizinhos do SDK e backend e não fazem parte do
build da Vercel.

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

## Tags e taxonomia

`/taxonomia` permite explorar tags por categoria, buscar sem distinção de acentos
ou filtrar os interesses do estudante. Busca e filtros ficam na URL e acompanham
a navegação ao detalhe e o retorno à exploração.

`/taxonomia/tags/:tagId` é o endereço compartilhável de uma tag. Exibe o caminho
na hierarquia, subtags, interesse pessoal e disciplinas paginadas. As disciplinas
são associações diretas: selecionar uma tag pai não agrega as filhas.

`/taxonomia/organizar` exige login e concentra a manutenção de categorias e tags.
O parâmetro `tagId` abre uma tag para edição. No desktop a edição fica ao lado da
estrutura; no celular ocupa a etapa de edição, com retorno pelo botão Cancelar.
Alterações não salvas exigem confirmação antes de sair ou trocar o item editado.
Renomear um termo afeta todos os seus usos. Excluir uma tag remove interesses
associados; vínculos com subtags, disciplinas, grupos ou eventos impedem a exclusão.

A exploração permite adicionar ou remover interesses diretamente nas linhas.
O detalhe apresenta breadcrumb navegável e omite paginação quando só há uma
página. A organização usa árvore e painel, com busca e seleção na URL; o contexto
validado em `returnTo` permite voltar ao detalhe e aos filtros de origem.
Voltar à estrutura no celular mantém busca, expansão, seleção e rolagem.

A contribuição global permanece aberta a qualquer pessoa autenticada, conforme
a decisão de produto de 01/11/2026. Sem perfil de estudante, a pessoa ainda pode
contribuir; apenas o registro de interesses exige esse perfil. A interface oculta
as entradas de manutenção de visitantes e trata recusas de autorização da API.

Edições com divergência observável em relação ao servidor preservam o rascunho e
solicitam reabertura do item. Essa comparação antes de salvar não substitui uma
operação atômica de versionamento no backend. O plano e as evidências da entrega
estão em [Fluxo de taxonomia](../docs/plano-melhoria-fluxo-taxonomia-pomi.md).

A adaptação visual às referências de 01/11/2026 agrupa a exploração por categoria,
mostra interesses por estrela e oferece chips removíveis e ordenação A–Z/Z–A
preservada no parâmetro `order`. O detalhe e o editor usam painéis de contexto e
resumos baseados nos campos existentes. As decisões sobre dados disponíveis e
capturas estão em [Adaptação visual da taxonomia](../docs/plans/resultado-referencia-visual-taxonomia-pomi.md).

A revisão de 02/11/2026 usa a largura comum de página e as composições
`AppliedFilters`, `Field`, `Section`, `InlineMessage`, `Badge`, `ActionBar` e
`ResponsiveDialog`. Criação e confirmações usam folha inferior no celular;
descarte e exclusão preservam o rascunho até a confirmação explícita.
Detalhes e evidências em [Alinhamento ao design system](../docs/plans/alinhamento-design-taxonomia-pomi.md).

A composição compacta da taxonomia prioriza listas e edição, com expansão das subtags na própria linha e contagens nos títulos das
seções. O editor só permite salvar mudanças e apresenta comparação de caminhos
quando categoria ou pai muda. A revisão visual e as evidências estão em
[Composição compacta da taxonomia](../docs/plans/composicao-compacta-taxonomia-pomi.md).

Exploração e organização da taxonomia usam a largura padrão (`PageContainer`),
como a busca de disciplinas e as telas de pessoas. A seção “Sobre as tags” foi removida.

## Programa na situação do curso

Em `/situacao-do-curso`, o resumo de **Vínculo acadêmico** fica acima de
**Cursando**, **Histórico** e **Integralização**. **Editar vínculo acadêmico** abre os
campos de curso e ingresso; a aba **Integralização** apresenta a consulta configurável
do programa na própria página. As abas internas **Currículo pleno**, **Proposta
de currículo** e **Árvore de dependências** reutilizam a composição de `/cursos`,
com seus blocos, tabelas, detalhes e navegação por dependências. As disciplinas
com aprovação registrada aparecem marcadas nas três visualizações. O detalhe
acadêmico reúne as tentativas do mesmo identificador de disciplina. O atalho
**Consultar histórico** abre a aba Histórico e posiciona o foco nela. O
planejamento permanece em seu fluxo próprio.

As contagens representam aprovações registradas em disciplinas obrigatórias
identificadas, não integralização oficial. Equivalências, avaliação automática de
pré-requisitos e alocação de créditos entre blocos eletivos não são calculadas.
Opções eletivas não são pendências individuais. Histórico vazio, carregando e
indisponível têm mensagens distintas; o currículo do catálogo continua
consultável mesmo quando os registros pessoais não carregam.
Nas tabelas da integralização, a pessoa pode ocultar e restaurar as disciplinas
com aprovação registrada.

Se o programa ainda não foi definido ou não estiver disponível no catálogo salvo,
a tela orienta a revisar a seleção. Sem modalidade, o núcleo comum permanece
disponível e a tela orienta a escolher a modalidade para consultar seus requisitos.

O histórico usa períodos expansíveis, busca por código ou nome sem distinção de
acentos e filtro por resultado. A busca alcança períodos recolhidos. A ação de
adicionar segue a aba ativa; edição e remoção de uma tentativa ficam no seu menu,
e a confirmação de remoção identifica disciplina e período.

**Importar histórico** reúne PDF da DAC (interpretado no navegador) e consulta
experimental via DAC. A prévia distingue novas tentativas, registros já existentes
e divergências. Somente registros selecionados são enviados; atualizar uma
divergência exige seleção explícita. Correspondências ambíguas exigem revisão
manual. As validações finais e o resultado por registro continuam no servidor.

A agenda usa grade em desktop e lista por dia no mobile. Ambas abrem **Aulas e
faltas**, com a mesma operação usada na Página inicial. Os períodos exibidos
usam o formato `2026 · 2º semestre`; códigos internos como `2026s2` são preservados.

## Configurações do guia de horário

O planejamento de semestre preserva currículo e programa independentemente.
Alternar Currículo, Programa ou Nenhum salva a última visualização escolhida,
sem remover configurações, disciplinas manuais ou turmas selecionadas.
O diálogo de configuração permite remover a configuração de programa explicitamente.
O campo de língua aparece somente quando o programa oferece opções de língua.
Seleções incompletas permanecem no formulário até poderem ser salvas.

O contrato utiliza o SDK publicado `1.0.0-rc.5`, fixado no manifesto e no
lockfile. O build não depende de um vínculo com o checkout local do SDK.

## Administração de feedbacks

Administradores acessam `/admin/feedbacks` pela seção Administração da navegação.
O acesso usa a role `ADMIN` informada pela App API em `/me`, sem exigir perfil de
estudante. A API também autoriza cada leitura e atualização administrativa.

A página permite buscar e filtrar feedbacks, marcar em análise, encerrar com
confirmação e reabrir. A mensagem da equipe é opcional e aparece em Meus feedbacks
para o autor identificado. Os filtros são locais sobre a coleção carregada pelo
SDK. Atualizações simultâneas seguem a semântica atual da API: a última prevalece.

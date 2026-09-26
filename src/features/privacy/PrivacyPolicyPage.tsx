import { Mail, Shield } from 'lucide-react'

import { PageContainer, PageHeader } from '@/components/PageLayout'
import { Card } from '@/components/ui/card'

function PolicySection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id}>
      <Card className="p-5 sm:p-6">
        <h2 id={id} className="text-lg font-extrabold sm:text-xl">
          {title}
        </h2>
        <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
          {children}
        </div>
      </Card>
    </section>
  )
}

export function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Documento legal"
        title="Política de Privacidade"
        description="Como o POMI coleta, utiliza e protege os seus dados pessoais, em conformidade com a LGPD."
      />

      <div className="space-y-6">
        {/* Introdução */}
        <section
          aria-labelledby="intro-title"
          className="rounded-lg border-2 border-strong-border bg-card p-5 shadow-[4px_4px_0_var(--primary)] sm:p-6"
        >
          <div className="flex items-start gap-4">
            <Shield className="mt-0.5 size-6 shrink-0 text-primary" />
            <div>
              <h2 id="intro-title" className="text-xl font-extrabold">
                Compromisso com a privacidade
              </h2>
              <div className="mt-2 space-y-3 leading-relaxed text-muted-foreground">
                <p>
                  Esta Política de Privacidade foi elaborada em conformidade com
                  a Lei Federal n. 12.965, de 23 de abril de 2014 (Marco Civil
                  da Internet), e com a Lei Federal n. 13.709, de 14 de agosto
                  de 2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).
                </p>
                <p>
                  Ao utilizar o POMI, o usuário confirma que leu e compreendeu
                  esta Política de Privacidade e concorda em ficar vinculado a
                  ela. Esta Política poderá ser atualizada em decorrência de
                  eventual atualização normativa, razão pela qual se convida o
                  usuário a consultá-la periodicamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Princípios LGPD */}
        <PolicySection id="principios" title="I — Princípios">
          <p>
            O POMI se compromete a cumprir as normas previstas na LGPD e
            respeitar os princípios dispostos no Art. 6º:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Finalidade:</strong>{' '}
              realização do tratamento para propósitos legítimos, específicos,
              explícitos e informados ao titular.
            </li>
            <li>
              <strong className="text-foreground">Adequação:</strong>{' '}
              compatibilidade do tratamento com as finalidades informadas ao
              titular.
            </li>
            <li>
              <strong className="text-foreground">Necessidade:</strong>{' '}
              limitação do tratamento ao mínimo necessário para a realização de
              suas finalidades.
            </li>
            <li>
              <strong className="text-foreground">Livre acesso:</strong>{' '}
              garantia, aos titulares, de consulta facilitada e gratuita sobre a
              forma e a duração do tratamento.
            </li>
            <li>
              <strong className="text-foreground">Qualidade dos dados:</strong>{' '}
              garantia de exatidão, clareza, relevância e atualização dos dados.
            </li>
            <li>
              <strong className="text-foreground">Transparência:</strong>{' '}
              garantia de informações claras, precisas e facilmente acessíveis
              sobre a realização do tratamento.
            </li>
            <li>
              <strong className="text-foreground">Segurança:</strong> utilização
              de medidas técnicas e administrativas aptas a proteger os dados
              pessoais.
            </li>
            <li>
              <strong className="text-foreground">Prevenção:</strong> adoção de
              medidas para prevenir a ocorrência de danos em virtude do
              tratamento.
            </li>
            <li>
              <strong className="text-foreground">Não discriminação:</strong>{' '}
              impossibilidade de realização do tratamento para fins
              discriminatórios ilícitos ou abusivos.
            </li>
            <li>
              <strong className="text-foreground">
                Responsabilização e prestação de contas:
              </strong>{' '}
              demonstração da adoção de medidas eficazes de proteção de dados.
            </li>
          </ul>
        </PolicySection>

        {/* Agentes de tratamento */}
        <PolicySection id="agentes" title="II — Agentes de tratamento">
          <p className="mb-3">
            A Lei Geral de Proteção de Dados define como controlador, operador e
            encarregado, em seu artigo 5º:
          </p>
          <ul className="list-disc space-y-2 pl-5 mb-4">
            <li>
              <strong className="text-foreground">
                Art. 5º, VI – Controlador:
              </strong>{' '}
              pessoa natural ou jurídica, de direito público ou privado, a quem
              competem as decisões referentes ao tratamento de dados pessoais;
            </li>
            <li>
              <strong className="text-foreground">
                Art. 5º, VII – Operador:
              </strong>{' '}
              pessoa natural ou jurídica, de direito público ou privado, que
              realiza o tratamento de dados pessoais em nome do controlador;
            </li>
            <li>
              <strong className="text-foreground">
                Art. 5º, VIII – Encarregado:
              </strong>{' '}
              pessoa indicada pelo controlador e operador para atuar como canal
              de comunicação entre o controlador, os titulares dos dados e a
              Agência Nacional de Proteção de Dados (ANPD).
            </li>
          </ul>
          <p>
            As decisões referentes ao tratamento de dados pessoais da plataforma
            POMI são de responsabilidade de{' '}
            <strong className="text-foreground">
              Gabriel Vinícius dos Santos Soares
            </strong>
            , na qualidade de controlador pessoa física.
          </p>
          <p>
            <strong className="text-foreground">E-mail:</strong>{' '}
            ominira.unicamp@gmail.com
          </p>
        </PolicySection>

        {/* Dados tratados e bases legais */}
        <PolicySection
          id="dados-coletados"
          title="III — Dados pessoais tratados e bases legais (Art. 7º da LGPD)"
        >
          <p>
            A utilização do POMI depende do tratamento dos seguintes dados
            pessoais, estritamente fornecidos de forma voluntária e explícita
            pelo próprio usuário:
          </p>

          <h3 className="text-base font-extrabold text-foreground">
            Dados de identificação
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>RA — Registro Acadêmico</li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Dados de perfil acadêmico
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Curso de graduação</li>
            <li>Modalidade curricular</li>
            <li>Ano de ingresso</li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Histórico escolar e desempenho
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Disciplinas cursadas (código, nome, período e ano letivo)</li>
            <li>Notas obtidas</li>
            <li>
              Situação de matrícula (aprovação, reprovação, desistência, etc.)
            </li>
            <li>Registro de faltas</li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Planejamento de estudos
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Planejamentos de graduação (simulações de conclusão de curso)
            </li>
            <li>
              Planejamentos semestrais (turmas e disciplinas selecionadas)
            </li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Perfil social
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nome de exibição público</li>
            <li>Biografia pública</li>
            <li>Interesses acadêmicos (tags de temas)</li>
            <li>Conexões de amizade (solicitações e aceitações)</li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Avaliações de docentes
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Notas de 1 a 5 em critérios de avaliação pedagógica</li>
          </ul>
          <p>
            O serviço é direcionado ao público universitário. O POMI não coleta
            intencionalmente dados de crianças (menores de 12 anos). O
            tratamento de dados de eventuais adolescentes regularmente
            matriculados na universidade será realizado nas hipóteses legais
            aplicáveis e sempre em observância ao seu melhor interesse, nos
            termos do art. 14 da LGPD.{' '}
          </p>

          <h3 className="mt-4 text-base font-extrabold text-foreground">
            Bases legais que autorizam o tratamento:
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">
                Execução de contrato / termos de uso (Art. 7º, V da LGPD):
              </strong>{' '}
              os dados de identificação, perfil acadêmico, histórico escolar,
              planejamento de curso e avaliações são tratados para viabilizar o
              cumprimento dos serviços da plataforma solicitados pelo titular,
              tais como a organização da grade curricular, montagem de horários
              e simulação de graduação.
            </li>
            <li>
              <strong className="text-foreground">
                Consentimento do titular (Art. 7º, I da LGPD):
              </strong>{' '}
              a ativação de perfil público, a exibição de biografia, o estabelecimento
              de conexões de amizade na plataforma e o compartilhamento de planejamentos
              de estudos com outros usuários, bem como a inscrição em alertas por
              e-mail, fundamentam-se exclusivamente no consentimento explícito do 
              titular (manifestação livre, informada e inequívoca). Essas funcionalidades 
              sociais são inteiramente opcionais e o consentimento pode ser revogado 
              a qualquer momento nas configurações.
            </li>
          </ul>
        </PolicySection>

        {/* Forma de coleta */}
        <PolicySection id="coleta" title="IV — Forma de coleta dos dados">
          <p>
            Todos os dados pessoais são fornecidos explicitamente pelo usuário.
            Nenhum dado é coletado automaticamente de sistemas da Unicamp ou de
            terceiros. Os meios de fornecimento são:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-foreground">
                Cadastro e autenticação:
              </strong>{' '}
              o usuário fornece suas credenciais e dados de identificação ao
              criar sua conta na plataforma.
            </li>
            <li>
              <strong className="text-foreground">
                Importação de histórico:
              </strong>{' '}
              o aluno fornece voluntariamente seu histórico escolar via upload
              de documento em PDF ou arquivo estruturado.
            </li>
            <li>
              <strong className="text-foreground">
                Interação na plataforma:
              </strong>{' '}
              informações de perfil, planejamentos, avaliações, preferências e
              feedbacks são fornecidos diretamente pelo usuário durante o uso do
              serviço.
            </li>
          </ul>
        </PolicySection>

        {/* Compartilhamento */}
        <PolicySection
          id="compartilhamento"
          title="V — Compartilhamento de Dados"
        >
          <p>
            Os dados pessoais do usuário{' '}
            <strong className="text-foreground">
              não são comercializados, vendidos ou compartilhados com terceiros
            </strong>{' '}
            para fins publicitários ou comerciais em nenhuma hipótese.
          </p>
          <p>
            Perfis públicos, conexões de amizade e planejamentos de estudos compartilhados
            são funcionalidades estritamente opcionais que operam sob o princípio de
            privacidade por padrão, estando desativadas e 
            ocultas inicialmente. A visibilidade dessas informações para outros usuários 
            da plataforma só ocorre mediante <strong>ação afirmativa e consentimento 
            explícito do aluno (opt-in)</strong>. O usuário tem total controle para 
            escolher o que deseja exibir e pode ocultar seu perfil, desfazer conexões 
            ou revogar o compartilhamento de planejamentos a qualquer momento.
          </p>
        </PolicySection>

        {/* Tratamentos e Tempo de Retenção */}
        <PolicySection
          id="tratamentos"
          title="VI — Operações de tratamento, retenção e descarte de dados (Arts. 15 e 16)"
        >
          <p>Os dados pessoais recebem os seguintes tratamentos:</p>
          <ul className="list-disc space-y-1 pl-5 mb-4">
            <li>
              <strong className="text-foreground">Coleta</strong> — recolhimento
              de dados com finalidade específica.
            </li>
            <li>
              <strong className="text-foreground">Armazenamento</strong> —
              manutenção em repositório de banco de dados.
            </li>
            <li>
              <strong className="text-foreground">Classificação</strong> —
              ordenação dos dados conforme critérios acadêmicos e de perfil.
            </li>
            <li>
              <strong className="text-foreground">Processamento</strong> —
              organização dos dados para gerar planejamentos, horários e
              recomendações.
            </li>
            <li>
              <strong className="text-foreground">Acesso</strong> — consulta dos
              dados pelo próprio titular.
            </li>
            <li>
              <strong className="text-foreground">Comunicação</strong> — envio
              de notificações por e-mail mediante consentimento.
            </li>
            <li>
              <strong className="text-foreground">Eliminação</strong> — exclusão
              dos dados mediante solicitação do titular.
            </li>
          </ul>

          <h3 className="text-base font-extrabold text-foreground">
            Prazo de retenção e critérios de descarte:
          </h3>
          <p>
            Os dados pessoais serão conservados enquanto o usuário mantiver sua
            conta ativa na plataforma e continuar usufruindo dos serviços.
          </p>
          <p>
            Ao solicitar o encerramento e exclusão de sua conta, todos os dados
            pessoais do titular serão definitivamente eliminados dos sistemas
            ativos, em prazo razoável, com exceção das hipóteses de guarda
            estritamente autorizadas ou impostas por lei (Art. 16 da LGPD).
          </p>
        </PolicySection>

        {/* Cookies */}
        <PolicySection id="cookies" title="VII — Cookies">
          <p>
            A aplicação do POMI não utiliza cookies em seu funcionamento, seja
            para rastreamento de usuários, publicidade ou análise
            comportamental.
          </p>
        </PolicySection>

        {/* Segurança */}
        <PolicySection
          id="seguranca"
          title="VIII — Segurança e Limites de Responsabilidade"
        >
          <p>
            O POMI se compromete a aplicar as medidas técnicas e organizativas
            aptas a proteger os dados pessoais de acessos não autorizados e de
            situações de destruição, perda, alteração, comunicação ou difusão de
            tais dados.
          </p>
          <p>
            O site utiliza criptografia para que os dados sejam transmitidos de
            forma segura e confidencial, de maneira que a transmissão dos dados
            entre o servidor e o usuário ocorra de maneira protegida por HTTPS.
          </p>
          <p>
            O POMI se isenta de responsabilidade apenas em casos de culpa
            exclusiva do usuário (como o compartilhamento indevido ou negligente
            de suas próprias credenciais com terceiros) ou de terceiros, nos
            estritos termos da lei e desde que comprovado que todas as medidas
            de segurança exigíveis e razoáveis foram plenamente adotadas pela
            administração da plataforma.
          </p>
          <p>
            O POMI se compromete a comunicar o usuário e a Agência Nacional
            de Proteção de Dados (ANPD) em prazo adequado caso ocorra algum
            incidente de segurança relevante que possa acarretar risco ou dano
            relevante aos seus direitos e liberdades pessoais, nos termos do
            Art. 48 da LGPD.
          </p>
        </PolicySection>

        {/* Direitos do titular */}
        {/* Direitos do titular */}
        <PolicySection
          id="direitos"
          title="IX — Direitos do titular dos dados (Arts. 18 a 20 da LGPD)"
        >
          <p>
            O titular dos dados pessoais poderá exercer, a qualquer momento e
            mediante requerimento expresso, os direitos previstos na Lei Geral
            de Proteção de Dados Pessoais, observadas as hipóteses e os limites
            estabelecidos pela legislação aplicável.
          </p>

          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">
                Confirmação da existência de tratamento (Art. 18, I):
              </strong>{' '}
              direito de obter a confirmação de que seus dados pessoais são
              objeto de tratamento pela plataforma.
            </li>

            <li>
              <strong className="text-foreground">
                Acesso aos dados (Art. 18, II):
              </strong>{' '}
              direito de acessar os dados pessoais tratados pelo POMI. A
              confirmação e o acesso serão fornecidos nos termos do Art. 19 da
              LGPD.
            </li>

            <li>
              <strong className="text-foreground">
                Retificação (Art. 18, III):
              </strong>{' '}
              direito de solicitar a correção de dados pessoais incompletos,
              inexatos ou desatualizados.
            </li>

            <li>
              <strong className="text-foreground">
                Anonimização, bloqueio ou eliminação (Art. 18, IV):
              </strong>{' '}
              direito de solicitar a anonimização, o bloqueio ou a eliminação de
              dados pessoais desnecessários, excessivos ou tratados em
              desconformidade com a LGPD, observadas as hipóteses legais que
              autorizem sua conservação.
            </li>

            <li>
              <strong className="text-foreground">
                Portabilidade (Art. 18, V):
              </strong>{' '}
              direito de solicitar a portabilidade dos dados pessoais a outro
              fornecedor de serviço ou produto, mediante requisição expressa, de
              acordo com a regulamentação da Agência Nacional de Proteção de
              Dados (ANPD) e observados os segredos comercial e industrial.
            </li>

            <li>
              <strong className="text-foreground">
                Eliminação dos dados tratados com consentimento (Art. 18, VI):
              </strong>{' '}
              direito de solicitar a eliminação dos dados pessoais tratados com
              base no consentimento, ressalvadas as hipóteses de conservação
              previstas no Art. 16 da LGPD.
            </li>

            <li>
              <strong className="text-foreground">
                Informação sobre compartilhamento (Art. 18, VII):
              </strong>{' '}
              direito de obter informações sobre as entidades públicas ou
              privadas com as quais o controlador tenha realizado uso
              compartilhado de seus dados pessoais.
            </li>

            <li>
              <strong className="text-foreground">
                Informação sobre o consentimento (Art. 18, VIII):
              </strong>{' '}
              direito de ser informado sobre a possibilidade de não fornecer
              consentimento e sobre as consequências dessa negativa, quando o
              tratamento depender de consentimento.
            </li>

            <li>
              <strong className="text-foreground">
                Revogação do consentimento (Art. 18, IX):
              </strong>{' '}
              direito de revogar o consentimento anteriormente concedido,
              mediante manifestação expressa, por procedimento gratuito e
              facilitado, quando o tratamento estiver fundamentado nessa base
              legal.
            </li>

            <li>
              <strong className="text-foreground">
                Oposição ao tratamento (Art. 18, § 2º):
              </strong>{' '}
              direito de opor-se ao tratamento realizado com fundamento em uma
              das hipóteses de dispensa de consentimento, quando houver
              descumprimento do disposto na LGPD.
            </li>

            <li>
              <strong className="text-foreground">
                Peticionamento perante a ANPD (Art. 18, § 1º):
              </strong>{' '}
              direito de peticionar em relação aos seus dados pessoais contra o
              controlador perante a Agência Nacional de Proteção de Dados,
              observados os procedimentos aplicáveis.
            </li>

            <li>
              <strong className="text-foreground">
                Revisão de decisões automatizadas (Art. 20):
              </strong>{' '}
              direito de solicitar a revisão de decisões tomadas unicamente com
              base em tratamento automatizado de dados pessoais que afetem seus
              interesses, inclusive decisões destinadas a definir seu perfil
              pessoal ou outros aspectos de sua personalidade, nos termos da
              LGPD.
            </li>
          </ul>

          <h3 className="mt-4 text-base font-extrabold text-foreground">
            Forma de exercício dos direitos
          </h3>

          <p>
            Os direitos poderão ser exercidos gratuitamente mediante
            requerimento expresso encaminhado ao canal de atendimento indicado
            nesta Política. Para proteger os dados pessoais contra solicitações
            fraudulentas, o POMI poderá solicitar informações razoavelmente
            necessárias à confirmação da identidade do requerente ou de seu
            representante legal.
          </p>

          <p>
            Os requerimentos serão atendidos nos termos, condições e prazos
            previstos na LGPD e na regulamentação aplicável. A confirmação da
            existência de tratamento e o acesso aos dados observarão, em
            particular, as modalidades previstas no Art. 19 da LGPD.
          </p>

          <p>
            Quando o tratamento tiver origem no consentimento do titular ou em
            contrato, poderá ser solicitada também cópia eletrônica integral dos
            dados pessoais, observados os segredos comercial e industrial e a
            regulamentação aplicável.
          </p>
        </PolicySection>

        {/* Legislação */}
        <PolicySection id="legislacao" title="X — Leis e normativos aplicáveis">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">
                Lei nº 13.709/2018 (LGPD):
              </strong>{' '}
              dispõe sobre o tratamento de dados pessoais, inclusive nos meios
              digitais.
            </li>
            <li>
              <strong className="text-foreground">
                Lei nº 12.965/2014 (Marco Civil da Internet):
              </strong>{' '}
              estabelece princípios, garantias, direitos e deveres para o uso da
              Internet no Brasil.
            </li>
            <li>
              <strong className="text-foreground">
                Lei nº 12.527/2011 (Lei de Acesso à Informação):
              </strong>{' '}
              regula o acesso a informações previsto na Constituição Federal.
            </li>
            <li>
              <strong className="text-foreground">Lei nº 12.737/2012:</strong>{' '}
              dispõe sobre a tipificação criminal de delitos informáticos.
            </li>
          </ul>
        </PolicySection>

        {/* Atualização */}
        <PolicySection id="atualizacao" title="XI — Atualização desta política">
          <p>
            Esta Política pode ser modificada a qualquer momento, especialmente
            para adaptar-se às evoluções do serviço, seja pela disponibilização
            de novas funcionalidades, seja pela supressão ou modificação
            daquelas já existentes.
          </p>
          <p>
            Qualquer alteração e/ou atualização desta Política de Privacidade
            passará a vigorar a partir da data de sua publicação no sítio do
            serviço e deverá ser integralmente observada pelos Usuários.
          </p>
          <p>
            Em nenhuma hipótese as condições de sigilo dos dados cadastrais dos
            Usuários serão afetadas por quaisquer modificações nesta política,
            sendo o direito garantido e mantido.
          </p>
        </PolicySection>

        {/* Contato */}
        <section
          aria-labelledby="contato-title"
          className="border-y-2 border-strong-border py-6"
        >
          <h2 id="contato-title" className="text-xl font-extrabold">
            Canal de contato para exercício de direitos
          </h2>
          <div className="mt-4">
            <a
              href="mailto:ominira.unicamp@gmail.com"
              className="pomi-focus flex items-start gap-3 rounded-md border-2 border-strong-border bg-card p-4 font-bold hover:bg-muted sm:inline-flex"
            >
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="break-all">ominira.unicamp@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}

import {
  BookOpen,
  Braces,
  ExternalLink,
  Github,
  GraduationCap,
  Instagram,
  Mail,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { publicApiUrl } from '@/api/client'
import { PageContainer, PageHeader } from '@/components/PageLayout'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const externalLinkClass =
  'pomi-focus inline-flex items-center gap-1 rounded-sm font-bold text-primary underline decoration-2 underline-offset-4 hover:text-foreground'

function InformationCard({
  icon,
  title,
  children,
  className,
  contentClassName,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <Card className={cn('p-5 sm:p-6', className)}>
      <div className="flex items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <div className={cn('mt-2 space-y-3 leading-relaxed text-muted-foreground', contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function AboutPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Projeto estudantil"
        title="Sobre nós"
        description="O POMI é uma ferramenta feita por alunos para ajudar outros alunos a compreender e organizar sua vida acadêmica."
      />

      <div className="space-y-6">
        <section
          aria-labelledby="independent-project-title"
          className="rounded-lg border-2 border-strong-border bg-card p-5 shadow-[4px_4px_0_var(--primary)] sm:p-6"
        >
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-0.5 size-6 shrink-0 text-primary" />
            <div>
              <h2 id="independent-project-title" className="text-xl font-extrabold">
                Um projeto independente
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                O POMI não possui vínculo, representação, autorização ou qualquer
                relação oficial com a Universidade Estadual de Campinas. Somos um
                projeto estudantil independente que utiliza dados abertos publicados
                pela Unicamp.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <InformationCard
            icon={<BookOpen className="size-5" />}
            title="Por que o POMI existe"
          >
            <p>
              Uma ferramenta para organizar a <strong className="text-foreground">vida acadêmica</strong> sem depender de uma
              única forma de planejamento.
            </p>
            <ul className="grid gap-2 text-sm font-semibold sm:grid-cols-3">
              <li className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Planejar a graduação</li>
              <li className="rounded-md bg-background px-3 py-2 text-foreground">Montar horários</li>
              <li className="rounded-md bg-accent px-3 py-2 text-accent-foreground">Consultar dados</li>
            </ul>
            <p>Também queremos que outros alunos possam verificar informações, explorar possibilidades e criar suas próprias soluções.</p>
          </InformationCard>

          <InformationCard
            icon={<Braces className="size-5" />}
            title="API aberta e software livre"
          >
            <p>
              A API foi pensada para ser <strong className="text-foreground">aberta desde o início</strong>: qualquer pessoa pode
              usar os dados do POMI para criar sua própria aplicação.
            </p>
            <div className="grid gap-2 text-sm">
              <a
                href={publicApiUrl('/public-docs')}
                target="_blank"
                rel="noopener noreferrer"
                className="pomi-focus rounded-md bg-primary px-3 py-2 font-bold text-primary-foreground hover:opacity-90"
              >
                Consultar documentação da API <ExternalLink className="ml-1 inline size-3.5" />
              </a>
              <p><strong className="text-foreground">Completamente FLOSS.</strong> Software livre e de código aberto, feito para ser usado, verificado e expandido.</p>
            </div>
          </InformationCard>

          <InformationCard icon={<Users className="size-5" />} title="Quem constrói">
            <p>
              O POMI é um projeto da <strong className="text-foreground">Ominira</strong>,
              uma entidade estudantil dedicada ao desenvolvimento de software livre.
            </p>
            <div className="space-y-3 text-sm">
              <div className="border-l-2 border-primary pl-3">
                <strong className="text-foreground">José Victor Santana Barbosa</strong>
                <span> ({' '}
                  <a
                    href="https://github.com/goliasvictor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={externalLinkClass}
                  >
                    Goliasvictor <ExternalLink className="size-3.5" />
                  </a>
                )</span>
                <p>Idealizou e desenvolveu a maior parte do projeto.</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <strong className="text-foreground">Gabriel Vinicius dos Santos Soares</strong>
                <span> ({' '}
                  <a
                    href="https://github.com/Gvinfinity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={externalLinkClass}
                  >
                    Gvinfinity <ExternalLink className="size-3.5" />
                  </a>
                )</span>
                <p>Contribuiu com a idealização, o planejamento e a criação do Infernalizador Automático.</p>
              </div>
            </div>
            <p>Contribuições de código, documentação, design, testes e ideias são bem-vindas.</p>
          </InformationCard>

          <InformationCard icon={<GraduationCap className="size-5" />} title="Origem dos dados">
            <p>Os dados acadêmicos são extraídos de páginas públicas da DAC:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <a
                  href="https://www.dac.unicamp.br/portal/caderno-de-horarios/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClass}
                >
                  Caderno de Horários <ExternalLink className="size-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.dac.unicamp.br/portal/graduacao/catalogos-de-cursos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClass}
                >
                  Catálogos de Cursos <ExternalLink className="size-3.5" />
                </a>
              </li>
            </ul>
          </InformationCard>

        </div>

        <section aria-labelledby="contact-title" className="border-y-2 border-strong-border py-6">
          <h2 id="contact-title" className="text-xl font-extrabold">Contato e contribuições</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a href="mailto:ominira.unicamp@gmail.com" className="pomi-focus flex items-start gap-3 rounded-md border-2 border-strong-border bg-card p-4 font-bold hover:bg-muted">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="break-all">ominira.unicamp@gmail.com</span>
            </a>
            <a href="https://www.instagram.com/ominira.unicamp/" target="_blank" rel="noopener noreferrer" className="pomi-focus flex items-center gap-3 rounded-md border-2 border-strong-border bg-card p-4 font-bold hover:bg-muted">
              <Instagram className="size-5 text-primary" /> @ominira.unicamp
            </a>
            <a href="https://github.com/ominira-unicamp" target="_blank" rel="noopener noreferrer" className="pomi-focus flex items-center gap-3 rounded-md border-2 border-strong-border bg-card p-4 font-bold hover:bg-muted">
              <Github className="size-5 text-primary" /> ominira-unicamp
            </a>
          </div>
        </section>

        <p className="text-center text-sm text-muted-foreground">
          O POMI nasceu a partir de uma conversa na sala 340 do IC3.
        </p>
      </div>
    </PageContainer>
  )
}

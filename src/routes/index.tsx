import { createFileRoute } from '@tanstack/react-router'

import { EmptyState, PageContainer, PageHeader } from '@/components/PageLayout'

export const Route = createFileRoute('/')({
  component: PlanningPage,
})

function PlanningPage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Seu planejamento"
        description="Organize os próximos períodos e acompanhe os requisitos do seu currículo."
      />
      <EmptyState
        title="Nenhum planejamento iniciado"
        description="Os dados e as ações do planejador serão conectados nesta área na próxima etapa."
      />
    </PageContainer>
  )
}

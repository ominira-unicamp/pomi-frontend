import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'
import { ExchangeAlertsSummary } from '@/features/exchange/components/ExchangeAlertsSummary'
import { ExchangeCatalogFilters } from '@/features/exchange/components/ExchangeCatalogFilters'
import { ExchangeNoticeCard } from '@/features/exchange/components/ExchangeNoticeCard'
import { ExchangeNoticePagination } from '@/features/exchange/components/ExchangeNoticePagination'
import { defaultExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import { useExchangeNoticesCatalog } from '@/features/exchange/hooks/useExchangeNoticesCatalog'

export function ExchangeNoticesPage() {
  const catalog = useExchangeNoticesCatalog()

  return (
    <PageContainer size="wide">
      <ExchangeAlertsSummary />
      <section aria-labelledby="exchange-notices-title">
        <div className="mb-5">
          <h2 id="exchange-notices-title" className="text-2xl font-black">
            Editais de intercâmbio
          </h2>
          <p className="mt-1 text-muted-foreground">
            Abra um edital para consultar os arquivos disponíveis.
          </p>
        </div>
        <ExchangeCatalogFilters
          filters={catalog.filters}
          issuers={catalog.issuers}
          places={catalog.places}
          onChange={catalog.changeFilters}
        />
        {catalog.noticesQuery.isLoading ? (
          <LoadingState label="Carregando editais" />
        ) : catalog.noticesQuery.isError ? (
          <ErrorState
            title="Não foi possível carregar os editais"
            description="Verifique sua conexão e tente novamente."
            action={{
              label: 'Tentar novamente',
              onClick: () => void catalog.noticesQuery.refetch(),
            }}
          />
        ) : catalog.notices.length === 0 ? (
          <EmptyState
            title="Nenhum edital publicado"
            description="Ainda não há editais disponíveis no POMI."
          />
        ) : catalog.processed.length === 0 ? (
          <EmptyState
            title="Nenhum edital encontrado"
            description="Remova alguns filtros para ampliar a busca."
            action={{
              label: 'Limpar filtros',
              onClick: () => catalog.changeFilters(defaultExchangeNoticeFilters),
            }}
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <strong>
                {catalog.processed.length === 1
                  ? '1 edital encontrado'
                  : `${catalog.processed.length} editais encontrados`}
              </strong>
              <span className="text-muted-foreground">
                Página {catalog.page} de {catalog.totalPages}
              </span>
            </div>
            <div className="space-y-4">
              {catalog.visible.map((notice) => (
                <ExchangeNoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
            <ExchangeNoticePagination
              page={catalog.page}
              totalPages={catalog.totalPages}
              onChange={catalog.setPage}
            />
          </>
        )}
      </section>
    </PageContainer>
  )
}

import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="flex min-h-28 flex-col items-start gap-4 bg-sidebar px-[1.375rem] py-5 text-sidebar-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 lg:px-[max(1.5rem,calc((100vw-67.5rem)/2))]">
      <div className="flex items-center gap-[0.9375rem]">
        <img
          src="/pomi-logo.svg"
          alt=""
          aria-hidden="true"
          className="h-[3.375rem] w-12 object-contain"
        />
        <strong className="text-xl font-extrabold">POMI</strong>
        <Link
          to="/sobre"
          className="pomi-focus inline-flex rounded-sm text-sm font-bold underline underline-offset-4"
        >
          Sobre nós
        </Link>
      </div>
      <p className="m-0 max-w-[29.375rem] rounded-[1.25rem_0.3125rem_1.25rem_0.3125rem] border border-sidebar-border px-[1.125rem] py-[0.8125rem] text-[0.78rem] leading-[1.45]">
        Projeto independente. Não possuímos vínculo, representação ou relação
        oficial com a Unicamp.
        <span className="mt-2 block">
          Um projeto da{' '}
          <a
            href="https://github.com/ominira-unicamp/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sidebar-foreground hover:underline"
          >
            Ominira
          </a>
          , desenvolvido por{' '}
          <a
            href="https://github.com/goliasvictor"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sidebar-foreground hover:underline"
          >
            Goliasvictor
          </a>
          .
        </span>
      </p>
    </footer>
  )
}

import { BookOpen, BookOpenCheck, CalendarDays, FileSearch, GraduationCap, Handshake, House, MessageSquareText, PanelsTopLeft, Tags, UserRound, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavigationItem = Readonly<{
  label: string
  to:
    | '/'
    | '/planejamentos-de-curriculo'
    | '/planejamentos-de-semestre'
    | '/situacao-do-curso'
    | '/disciplinas'
    | '/cursos'
    | '/perfil'
    | '/pessoas'
    | '/grupos'
    | '/eventos'
    | '/taxonomia'
    | '/editais-de-intercambio'
    | '/minhas-solicitacoes'
    | '/admin/feedbacks'
  icon: LucideIcon
  matches: ReadonlyArray<string>
  requiresAuth?: boolean
}>

const homeNavigationItem: NavigationItem = {
  label: 'Início',
  to: '/',
  icon: House,
  matches: ['/'],
}

const curriculumNavigationItem: NavigationItem = {
  label: 'Planejar graduação',
  to: '/planejamentos-de-curriculo',
  icon: PanelsTopLeft,
  matches: ['/planejamentos-de-curriculo'],
}

const semesterNavigationItem: NavigationItem = {
  label: 'Planejar semestre',
  to: '/planejamentos-de-semestre',
  icon: CalendarDays,
  matches: ['/planejamentos-de-semestre'],
}

export const navigationGroups: ReadonlyArray<
  Readonly<{ label?: string; items: ReadonlyArray<NavigationItem> }>
> = [
  {
    items: [
      homeNavigationItem,
      {
        label: 'Situação do curso',
        to: '/situacao-do-curso',
        icon: BookOpenCheck,
        matches: ['/situacao-do-curso'],
        requiresAuth: true,
      },
    ],
  },
  {
    label: 'Planejamento',
    items: [curriculumNavigationItem, semesterNavigationItem],
  },
  {
    label: 'Catálogo acadêmico',
    items: [
      {
        label: 'Cursos',
        to: '/cursos',
        icon: GraduationCap,
        matches: ['/cursos'],
      },
      {
        label: 'Disciplinas',
        to: '/disciplinas',
        icon: BookOpen,
        matches: ['/disciplinas'],
      },
    ],
  },
  {
    label: 'Comunidade',
    items: [
      {
        label: 'Meu perfil',
        to: '/perfil',
        icon: UserRound,
        matches: ['/perfil'],
        requiresAuth: true,
      },
      {
        label: 'Pessoas',
        to: '/pessoas',
        icon: Users,
        matches: ['/pessoas', '/perfis'],
        requiresAuth: true,
      },
      {
        label: 'Grupos',
        to: '/grupos',
        icon: Handshake,
        matches: ['/grupos', '/meus-grupos'],
      },
      {
        label: 'Eventos',
        to: '/eventos',
        icon: CalendarDays,
        matches: ['/eventos'],
      },
    ],
  },
  {
    label: 'Recursos',
    items: [
      {
        label: 'Tags',
        to: '/taxonomia',
        icon: Tags,
        matches: ['/taxonomia'],
      },
      {
        label: 'Intercâmbio',
        to: '/editais-de-intercambio',
        icon: FileSearch,
        matches: ['/editais-de-intercambio'],
      },
      {
        label: 'Meus feedbacks',
        to: '/minhas-solicitacoes',
        icon: MessageSquareText,
        matches: ['/minhas-solicitacoes'],
        requiresAuth: true,
      },
    ],
  },
]

export function matchesNavigationItem(pathname: string, item: NavigationItem) {
  return item.matches.some((path) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(`${path}/`),
  )
}

export const mobilePrimaryNavigationItems = [
  homeNavigationItem,
  { ...curriculumNavigationItem, label: 'Graduação' },
  { ...semesterNavigationItem, label: 'Semestre' },
] as const satisfies ReadonlyArray<NavigationItem>

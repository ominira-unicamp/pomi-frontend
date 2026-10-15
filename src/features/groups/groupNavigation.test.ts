import { describe, expect, it } from 'vitest'
import { canOrganizeEvents, groupWorkspaceDestination } from './groupNavigation'

describe('group workspace destinations', () => {
  it.each(['EVENT_CREATE', 'EVENT_EDIT', 'EVENT_PUBLISH'] as const)(
    'opens events for %s without requiring another event capability',
    (permission) => {
      expect(canOrganizeEvents([permission])).toBe(true)
      expect(groupWorkspaceDestination([permission])).toBe(
        '/grupos/$groupId/gerenciar/eventos',
      )
    },
  )

  it('sends other managers to the first section they may access', () => {
    expect(groupWorkspaceDestination(['MEMBER_MANAGE'])).toBe(
      '/grupos/$groupId/gerenciar/pessoas',
    )
    expect(groupWorkspaceDestination(['ROLE_MANAGE'])).toBe(
      '/grupos/$groupId/gerenciar/acessos',
    )
    expect(groupWorkspaceDestination(['GROUP_EDIT'])).toBe(
      '/grupos/$groupId/gerenciar/perfil',
    )
    expect(groupWorkspaceDestination(['GROUP_TAG_MANAGE'])).toBe(
      '/grupos/$groupId/gerenciar/perfil',
    )
    expect(canOrganizeEvents(['MEMBER_MANAGE'])).toBe(false)
  })
})

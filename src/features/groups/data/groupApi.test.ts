import { afterEach, describe, expect, it, vi } from 'vitest'
import { groupApi } from './groupApi'

const token = () => Promise.resolve('token')
afterEach(() => vi.unstubAllGlobals())

describe('group request targets', () => {
  it('keeps user, group and child IDs explicit in management paths', async () => {
    const fetch = vi.fn().mockImplementation((_url, init) =>
      Promise.resolve(
        init.method === 'DELETE'
          ? new Response(null, { status: 204 })
          : new Response(
              JSON.stringify({
                data: [],
                quantity: 0,
                total: 0,
                links: { next: null },
              }),
              { status: 200 },
            ),
      ),
    )
    vi.stubGlobal('fetch', fetch)
    await groupApi.managedMembers(41, 8, token)
    await groupApi.managedEvents(41, 8, token)
    await groupApi.managedInvitations(41, 8, token)
    await groupApi.roles(41, 8, token)
    await groupApi.updateMember(41, 8, 9, { roles: { add: [6] } }, token)
    await groupApi.updateRole(41, 8, 6, { name: 'Gestão' }, token)
    await groupApi.deleteRole(41, 8, 6, token)
    await groupApi.updateEvent(41, 8, 5, { name: 'Evento' }, token)
    await groupApi.publishEvent(41, 8, 5, token)
    await groupApi.cancelEvent(41, 8, 5, token)
    expect(
      fetch.mock.calls.map(([url, init]) => [
        new URL(url).pathname,
        init.method ?? 'GET',
      ]),
    ).toEqual([
      ['/users/41/groups/8/memberships', 'GET'],
      ['/users/41/groups/8/events', 'GET'],
      ['/users/41/groups/8/invitations', 'GET'],
      ['/users/41/groups/8/roles', 'GET'],
      ['/users/41/groups/8/memberships/9', 'PATCH'],
      ['/users/41/groups/8/roles/6', 'PATCH'],
      ['/users/41/groups/8/roles/6', 'DELETE'],
      ['/users/41/groups/8/events/5', 'PATCH'],
      ['/users/41/groups/8/events/5/publish', 'POST'],
      ['/users/41/groups/8/events/5/cancel', 'POST'],
    ])
  })

  it('uses the same user and group order for editing, archiving and inviting', async () => {
    const fetch = vi.fn().mockImplementation((url) =>
      Promise.resolve(
        new URL(url).pathname.endsWith('/archive')
          ? new Response(null, { status: 204 })
          : new Response('{}', {
              status: new URL(url).pathname.endsWith('/invitations')
                ? 201
                : 200,
            }),
      ),
    )
    vi.stubGlobal('fetch', fetch)
    await groupApi.update(41, 8, { name: 'Grupo' }, token)
    await groupApi.archive(41, 8, token)
    await groupApi.invite(41, 8, 'person-public-id', token)
    expect(fetch.mock.calls.map(([url]) => new URL(url).pathname)).toEqual([
      '/users/41/groups/8',
      '/users/41/groups/8/archive',
      '/users/41/groups/8/invitations',
    ])
    expect(JSON.parse(fetch.mock.calls[2][1].body)).toEqual({
      recipientPublicId: 'person-public-id',
    })
  })
})

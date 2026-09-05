import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  acceptFriendship,
  hasPublicProfileChanges,
  publicProfileUpdateInput,
  requestFriendship,
  searchPeople,
  updatePublicProfile,
} from '@/features/friends/studentSocialApi'

const getAccessToken = vi.fn(() => Promise.resolve('access-token'))

describe('student social API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    getAccessToken.mockClear()
  })

  it('searches public people without caching private requests', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ items: [], total: 0 }), { status: 200 }),
      )
    await searchPeople(7, 'Ada Lovelace', getAccessToken)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/student\/7\/people\?query=Ada%20Lovelace&page=1&pageSize=20$/,
      ),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('updates only the public profile representation', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ enabled: true }), { status: 200 }),
      )
    await updatePublicProfile(7, { enabled: true, bio: 'Olá' }, getAccessToken)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/student\/7\/public-profile$/),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ enabled: true, bio: 'Olá' }),
      }),
    )
  })

  it('does not send profile fields that are owned by the server', () => {
    expect(
      publicProfileUpdateInput({
        publicId: 'a375fdb0-45d9-4a79-8415-89fcb64157b6',
        displayName: 'Ada',
        bio: 'Olá',
        program: { code: 34, name: 'Computação' },
        specialization: { code: 'CC', name: 'Integral' },
        entryYear: 2026,
        enabled: true,
        showProgram: true,
        showSpecialization: false,
        showEntryYear: true,
      }),
    ).toEqual({
      enabled: true,
      displayName: 'Ada',
      bio: 'Olá',
      showProgram: true,
      showSpecialization: false,
      showEntryYear: true,
    })
  })

  it('detects changes only in editable public profile fields', () => {
    const profile = {
      publicId: 'a375fdb0-45d9-4a79-8415-89fcb64157b6',
      displayName: 'Ada',
      bio: null,
      program: null,
      specialization: null,
      entryYear: 2026,
      enabled: true,
      showProgram: false,
      showSpecialization: false,
      showEntryYear: false,
    }
    expect(hasPublicProfileChanges(profile, profile)).toBe(false)
    expect(hasPublicProfileChanges({ ...profile, bio: 'Olá' }, profile)).toBe(
      true,
    )
    expect(
      hasPublicProfileChanges(
        { ...profile, program: { code: 34, name: 'Computação' } },
        profile,
      ),
    ).toBe(false)
  })

  it('creates and accepts a friendship through explicit actions', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 11 }), { status: 201 }),
      )
    await requestFriendship(
      7,
      'a375fdb0-45d9-4a79-8415-89fcb64157b6',
      getAccessToken,
    )
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/\/student\/7\/friendships$/),
      expect.objectContaining({ method: 'POST' }),
    )
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 11 }), { status: 200 }),
    )
    await acceptFriendship(7, 11, getAccessToken)
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringMatching(/\/student\/7\/friendships\/11\/accept$/),
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

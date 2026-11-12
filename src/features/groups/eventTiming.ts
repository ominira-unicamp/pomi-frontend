import type { GroupEvent } from '@ominira/pomi-sdk/generated/app'

export function eventPeriod(
  event: Pick<GroupEvent, 'startsAt' | 'endsAt'>,
  now: number,
): 'upcoming' | 'ongoing' | 'past' | 'undated' {
  if (!event.startsAt) return 'undated'
  if (new Date(event.startsAt).getTime() > now) return 'upcoming'
  if (event.endsAt && new Date(event.endsAt).getTime() > now) return 'ongoing'
  return 'past'
}

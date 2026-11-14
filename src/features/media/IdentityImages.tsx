import { MediaImage } from './MediaImage'

type AvatarProps = {
  mediaId?: string | null
  name: string
  size?: 'small' | 'compact' | 'medium' | 'large'
  access?: 'public' | 'private'
  alt?: string
}

const sizes = {
  small: { pixels: 32, className: 'size-8 text-xs' },
  compact: { pixels: 40, className: 'size-10 text-sm' },
  medium: { pixels: 44, className: 'size-11 text-base' },
  large: { pixels: 80, className: 'size-20 text-3xl' },
}

function IdentityAvatar({
  mediaId,
  name,
  size = 'medium',
  access = 'public',
  alt = '',
}: AvatarProps) {
  const dimensions = sizes[size]
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toLocaleUpperCase('pt-BR') || '?'
  return (
    <MediaImage
      mediaId={mediaId}
      preset={size === 'large' ? 'avatarLarge' : 'avatarSmall'}
      access={access}
      alt={alt}
      width={dimensions.pixels}
      height={dimensions.pixels}
      className={`${dimensions.className} rounded-full block shrink-0 object-cover object-center`}
      fallback={
        <span
          aria-hidden="true"
          className={`${dimensions.className} rounded-full grid shrink-0 place-items-center bg-primary font-black text-primary-foreground`}
        >
          {initials}
        </span>
      }
    />
  )
}

export function PersonAvatar(props: AvatarProps) {
  return <IdentityAvatar {...props} />
}

export function GroupAvatar(props: AvatarProps) {
  return <IdentityAvatar {...props} />
}

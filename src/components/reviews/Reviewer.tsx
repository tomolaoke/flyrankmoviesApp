import { Avatar } from './Avatar'
import { Username } from './Username'

interface ReviewerProps {
  avatar: string
  name: string
}

/** Circular avatar + username on the left side of a review footer. */
export function Reviewer({ avatar, name }: ReviewerProps) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar src={avatar} name={name} />
      <Username>{name}</Username>
    </span>
  )
}

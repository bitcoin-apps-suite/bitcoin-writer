'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface TweetCardProps {
  tweet: {
    id: string
    content: string
    createdAt: Date
    user: {
      id: string
      name: string | null
      username: string
      image: string | null
    }
    _count: {
      likes: number
      retweets: number
      comments: number
    }
  }
  onLike?: () => void
  onRetweet?: () => void
  isLiked?: boolean
  isRetweeted?: boolean
}

export function TweetCard({
  tweet,
  onLike,
  onRetweet,
  isLiked = false,
  isRetweeted = false
}: TweetCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [retweeted, setRetweeted] = useState(isRetweeted)
  const [likeCount, setLikeCount] = useState(tweet._count.likes)
  const [retweetCount, setRetweetCount] = useState(tweet._count.retweets)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    onLike?.()
  }

  const handleRetweet = () => {
    setRetweeted(!retweeted)
    setRetweetCount(retweeted ? retweetCount - 1 : retweetCount + 1)
    onRetweet?.()
  }

  return (
    <div className="border-b p-4 hover:bg-accent/50 transition">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={tweet.user.image || ''} />
          <AvatarFallback>{tweet.user.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <p className="font-semibold">{tweet.user.name}</p>
            <p className="text-muted-foreground">@{tweet.user.username}</p>
            <span className="text-muted-foreground">·</span>
            <p className="text-muted-foreground">
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{tweet.content}</p>
          <div className="mt-4 flex space-x-8">
            <Button variant="ghost" size="sm" className="space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{tweet._count.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`space-x-1 ${retweeted ? 'text-green-500' : ''}`}
              onClick={handleRetweet}
            >
              <Repeat2 className="h-4 w-4" />
              <span>{retweetCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`space-x-1 ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
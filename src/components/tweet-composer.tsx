'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Image, Smile } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface TweetComposerProps {
  onTweetPosted?: () => void
}

export function TweetComposer({ onTweetPosted }: TweetComposerProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsPosting(true)
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setContent('')
        toast({
          title: 'Tweet posted successfully!',
        })
        onTweetPosted?.()
      } else {
        throw new Error('Failed to post tweet')
      }
    } catch (error) {
      toast({
        title: 'Error posting tweet',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsPosting(false)
    }
  }

  if (!session?.user) return null

  return (
    <div className="border-b p-4">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 p-0 text-lg focus-visible:ring-0"
            maxLength={280}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {content.length}/280
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isPosting}
              >
                {isPosting ? 'Posting...' : 'Tweet'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { TweetComposer } from '@/components/tweet-composer'
import { TweetCard } from '@/components/tweet-card'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {
    try {
      const response = await fetch('/api/tweets')
      if (response.ok) {
        const data = await response.json()
        setTweets(data)
      }
    } catch (error) {
      console.error('Failed to fetch tweets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tweetId: string) => {
    try {
      await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to like tweet:', error)
    }
  }

  const handleRetweet = async (tweetId: string) => {
    try {
      await fetch(`/api/tweets/${tweetId}/retweet`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to retweet:', error)
    }
  }

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64">
        <Sidebar />
      </div>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">Home</h2>
          </div>
          <TweetComposer onTweetPosted={fetchTweets} />
          <div>
            {loading ? (
              <div className="p-8 text-center">Loading tweets...</div>
            ) : tweets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No tweets yet. Be the first to tweet!
              </div>
            ) : (
              tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  onLike={() => handleLike(tweet.id)}
                  onRetweet={() => handleRetweet(tweet.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <div className="w-80 border-l p-4">
        <div className="rounded-lg bg-accent p-4">
          <h3 className="mb-3 font-bold">What's happening</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Trending</p>
              <p className="font-semibold">#Bitcoin</p>
              <p className="text-xs text-muted-foreground">42.1K Tweets</p>
            </div>
            <div>
              <p className="text-muted-foreground">Technology</p>
              <p className="font-semibold">#Web3</p>
              <p className="text-xs text-muted-foreground">8.5K Tweets</p>
            </div>
            <div>
              <p className="text-muted-foreground">Trending</p>
              <p className="font-semibold">#Decentralized</p>
              <p className="text-xs text-muted-foreground">5.2K Tweets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64">
        <Sidebar />
      </div>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="relative px-4 pb-4">
            <Avatar className="absolute -top-16 h-32 w-32 border-4 border-background">
              <AvatarImage src={session.user.image || ''} />
              <AvatarFallback className="text-3xl">
                {session.user.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex justify-end pt-4">
              <Button variant="outline">Edit profile</Button>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-muted-foreground">@{session.user.username}</p>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4" />
                Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="mt-4 flex space-x-4 text-sm">
                <span>
                  <strong>0</strong> Following
                </span>
                <span>
                  <strong>0</strong> Followers
                </span>
              </div>
            </div>
          </div>
          <div className="border-t">
            <div className="p-8 text-center text-muted-foreground">
              No tweets yet
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
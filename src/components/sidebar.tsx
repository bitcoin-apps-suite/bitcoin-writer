'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, Mail, Bookmark, User, LogOut, Plus } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Messages', href: '/messages', icon: Mail },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Profile', href: '/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="sticky top-0 flex h-screen flex-col justify-between border-r p-4">
      <div className="space-y-2">
        <h1 className="mb-8 text-2xl font-bold text-primary">Bitcoin Twitter</h1>
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent ${
                pathname === item.href ? 'bg-accent' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          )
        })}
        <Button className="w-full" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden lg:block">Tweet</span>
        </Button>
      </div>
      {session?.user && (
        <div className="flex items-center space-x-3 rounded-lg p-3 hover:bg-accent">
          <Avatar>
            <AvatarImage src={session.user.image || ''} />
            <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-1 lg:block">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">@{session.user.username}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="hidden lg:flex"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
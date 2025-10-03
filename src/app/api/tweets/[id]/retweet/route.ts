import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tweetId = params.id
    const userId = session.user.id

    // Check if already retweeted
    const existingRetweet = await prisma.retweet.findUnique({
      where: {
        userId_tweetId: {
          userId,
          tweetId,
        },
      },
    })

    if (existingRetweet) {
      // Un-retweet
      await prisma.retweet.delete({
        where: {
          id: existingRetweet.id,
        },
      })
      return NextResponse.json({ retweeted: false })
    } else {
      // Retweet
      await prisma.retweet.create({
        data: {
          userId,
          tweetId,
        },
      })
      return NextResponse.json({ retweeted: true })
    }
  } catch (error) {
    console.error('Failed to toggle retweet:', error)
    return NextResponse.json(
      { message: 'Failed to toggle retweet' },
      { status: 500 }
    )
  }
}
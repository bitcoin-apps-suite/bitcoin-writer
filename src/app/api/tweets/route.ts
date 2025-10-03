import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json(tweets)
  } catch (error) {
    console.error('Failed to fetch tweets:', error)
    return NextResponse.json(
      { message: 'Failed to fetch tweets' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Tweet content is required' },
        { status: 400 }
      )
    }

    const tweet = await prisma.tweet.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(tweet, { status: 201 })
  } catch (error) {
    console.error('Failed to create tweet:', error)
    return NextResponse.json(
      { message: 'Failed to create tweet' },
      { status: 500 }
    )
  }
}
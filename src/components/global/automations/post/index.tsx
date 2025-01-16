import { useAutomationPosts } from '@/hooks/use-automations'
import { useQueryAutomationPosts } from '@/hooks/user-queries'
import React from 'react'
import TriggerButton from '../trigger-button'
import { InstagramPostProps } from '@/types/posts.type'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'

type Props = {
  id: string
}

const PostButton = ({ id }: Props) => {
  const { data } = useQueryAutomationPosts()
  const { posts, onSelectPost, mutate, isPending } = useAutomationPosts(id)

  return (
    <TriggerButton label="Attach a post">
      {data?.status === 404 && data?.message === 'No Instagram integration found' ? (
        <div className="flex flex-col gap-y-3 items-center justify-center p-4">
          <p className="text-text-secondary text-sm">No Instagram integration found.</p>
          <p className="text-text-secondary text-sm">Please connect your Instagram account first.</p>
        </div>
      ) : data?.status === 200 ? (
        <div className="flex flex-col gap-y-3 w-full">
          <div className="flex flex-wrap w-full gap-3">
            {data.data.data.map((post: InstagramPostProps) => (
              <div
                className="relative w-4/12 aspect-square rounded-lg cursor-pointer overflow-hidden"
                key={post.id}
                onClick={() =>
                  onSelectPost({
                    postid: post.id,
                    media: post.media_url,
                    mediaType: post.media_type,
                    caption: post.caption,
                  })
                }
              >
                {posts.find((p) => p.postid === post.id) && (
                  <CheckCircle
                    fill="white"
                    stroke="black"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                  />
                )}
                <Image
                  fill
                  sizes="100vw"
                  src={post.media_url}
                  alt="post image"
                  className={cn(
                    'hover:opacity-75 transition duration-100',
                    posts.find((p) => p.postid === post.id) && 'opacity-75'
                  )}
                />
              </div>
            ))}
          </div>
          {posts.length > 0 && (
            <Button
              onClick={() => mutate({ posts })}
              disabled={isPending}
              className="bg-gradient-to-br from-[#3352CC] font-medium text-white to-[#1C2D70] mt-3"
            >
              <Loader state={isPending}>Attach Posts</Loader>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-3 items-center justify-center p-4">
          <p className="text-text-secondary text-sm">
            {data?.message || 'Error loading Instagram posts. Please try again.'}
          </p>
        </div>
      )}
    </TriggerButton>
  )
}

export default PostButton

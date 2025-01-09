'use server'

import { client } from '@/lib/prisma'

export const findUser = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
        },
      },
    },
  })
}

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  // Check if user already exists by clerkId
  const existingUserByClerkId = await client.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (existingUserByClerkId) {
    // If user exists, update their information
    return await client.user.update({
      where: {
        clerkId,
      },
      data: {
        firstname,
        lastname,
        email,
      },
      select: {
        firstname: true,
        lastname: true,
      },
    });
  }

  // Check if user with email already exists
  const existingUserByEmail = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUserByEmail) {
    throw new Error('User with this email already exists');
  }

  // Create new user if they don't exist
  return await client.user.create({
    data: {
      clerkId,
      firstname,
      lastname,
      email,
      subscription: {
        create: {},
      },
    },
    select: {
      firstname: true,
      lastname: true,
    },
  });
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: 'PRO' | 'FREE' }
) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      subscription: {
        update: {
          data: {
            ...props,
          },
        },
      },
    },
  })
}

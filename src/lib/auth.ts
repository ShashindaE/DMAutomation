import { currentUser } from '@clerk/nextjs/server';

export const auth = async () => {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
};

// For backward compatibility
export const getAuthUserDetails = auth;

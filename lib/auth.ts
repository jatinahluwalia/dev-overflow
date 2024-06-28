'use server';

import User from '@/database/user.model';
import { auth } from '@clerk/nextjs/server';

export const getMongoId = async (): Promise<string> => {
  const { userId } = auth();
  const mongoUser = await User.findOne({ clerkId: userId });
  if (!mongoUser) throw new Error('Not authorized');
  return mongoUser.id;
};

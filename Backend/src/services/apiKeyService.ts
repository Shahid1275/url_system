import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export const generateApiKey = async (userId: string) => {
  const existingKey = await prisma.api_key.findFirst({
    where: { user_id: userId },  
  });

  if (existingKey) {
    throw new Error('API Key already exists for this user');
  }

  const newApiKey = await prisma.api_key.create({
    data: {
      api_key: nanoid(40),
      user_id: userId,
    },
  });

  return newApiKey;
};

export const deleteApiKey = async (userId: string) => {
  const existingKey = await prisma.api_key.findFirst({
    where: { user_id: userId },  
  });

  if (!existingKey) {
    throw new Error('No API Key found for this user');
  }

  await prisma.api_key.delete({
    where: { api_key_id: existingKey.api_key_id },    });
};

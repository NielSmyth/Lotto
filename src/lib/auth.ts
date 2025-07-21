'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSession, deleteSession } from './session';
import { dbService } from './db';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// In a real app, use a secure password hashing library like bcrypt or argon2
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return password === hash;
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: 'Invalid form data.' };
  }

  const { email, password } = parsed.data;
  const user = await dbService.findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id, user.role);

  if (user.role === 'ADMIN') {
    redirect('/dashboard');
  } else {
    redirect('/my-applications');
  }
}

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: 'Invalid form data.' };
  }

  const { fullName, email, password } = parsed.data;

  const existingUser = await dbService.findUserByEmail(email);
  if (existingUser) {
    return { error: 'An account with this email already exists.' };
  }
  
  // In a real app, hash the password
  const passwordHash = password;

  await dbService.createUser({ fullName, email, passwordHash });

  redirect('/login');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

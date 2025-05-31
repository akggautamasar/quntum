import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { env } from '@/env';

const s = {
	extra: {
		type: 'string'
	}
} as const;

export const auth = betterAuth({
	appName: 'Better Auth Demo',
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.usersTable,
			...schema
		}
	}),

	account: {
		accountLinking: {
			trustedProviders: ['google', 'github']
		}
	},
	socialProviders: {
		google: {
			clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
			clientSecret: env.GOOGLE_CLIENT_SECRET || ''
		},
		github: {
			clientId: env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
			clientSecret: env.GITHUB_CLIENT_SECRET || ''
		}
	},
	plugins: [nextCookies()]
});

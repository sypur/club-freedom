# Getting Started

This guide walks through setting up the Sypur Testimonial Platform for local development.

## Prerequisites

- Node.js 20+
- pnpm
- Convex account for the backend
- Cloudflare account for R2 storage
- Google Gemini API key for AI features

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hack-van/for-club-freedom-2025.git
   cd for-club-freedom-2025
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables. Most of the setup involves creating the required accounts and storing your personal keys:
   1. Setting up [Better Auth](./configuration.md#better-auth)
   2. Setting up [Resend](./configuration.md#resend)
   3. Setting up [R2 for Convex](./configuration.md#cloudflare-r2)
   4. Configuring [Cloudflare Turnstile](./configuration.md#cloudflare-turnstile)
   5. Configuring [Posthog](./configuration.md#posthog)
   6. Populating local environment files

4. Set up local domains and HTTPS (see the [Local Domains and HTTPS](./configuration.md#local-domains-and-https-setup) guide).

5. Run the development servers. You can start the frontend `vite`, backend `convex` and backend `trigger.dev` in separate terminals:

   ```bash
   # Vite dev server
   pnpm dev:vite

   # Convex sync engine
   pnpm dev:convex

   # Trigger.dev dev server
   pnpm dev:trigger
   ```

   Or run all concurrently:

   ```bash
   pnpm dev
   ```

Visit [https://localhost:3000](https://localhost:3000) to verify the app loads. If you encounter a 500 Internal Server Error after connecting, temporarily try another developer's Convex environment keys and then replace them incrementally with your own to identify the problematic value. Ensure your local `convex/.env.local` matches the Cloud Convex environment variables for your environment. The local React app must run at `https://localhost:3000` so browser APIs for camera and audio are available.

## Setting Up Better Auth with Convex

1. Run `pnpm install` to ensure dependencies are installed.
2. Create the `BETTER_AUTH_SECRET` environment variable in your Convex environment:

   ```bash
   npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   ```

3. Add your site URL to Convex:

   ```bash
   npx convex env set SITE_URL https://localhost:3000
   ```

   Use your production site URL in the production environment.

4. Set `VITE_CONVEX_SITE_URL` in your local `.env` file.

Refer to the [Better Auth guide](https://convex-better-auth.netlify.app/framework-guides/tanstack-start) for more background. Whenever you modify the Better Auth schemas or components, regenerate types with:

```bash
pnpm auth:generate
```

Better Auth tables are visible under the Better Auth component in the Convex dashboard.

![betterAuth](./images/betterAuth_component.png)

## Setting Up Resend

We use [Resend](https://resend.com) to send transactional emails.

1. Register for a Resend account.
2. Generate an API key.
3. Verify your domain.
4. Set the `RESEND_API_KEY` environment variable in Convex with the API key value.

Follow the [Convex Resend component instructions](https://www.convex.dev/components/resend) for detailed setup. A verified domain improves deliverability.

## Creating the First Admin User

Create the first admin through the Convex dashboard:

1. Open the `createAdminUser` function.
2. Click **Run Function**.
3. Provide the name, email, and password.
4. Execute the mutation.

![admin_create](./images/create_admin.png)

Then manually set the user's role in the `betterAuth.users` table.

![admin](./images/better_auth_admin_set.png)

## Setting Up R2 for Convex

Follow the _Cloudflare Account_ section in the [Convex R2 documentation](https://www.convex.dev/components/cloudflare-r2#cloudflare-account) to connect R2 to Convex.

## Testing Trigger.dev media processing job in dev environment

1. Add `TRIGGER_PROJECT_REF` to your local environment variables file.
2. Set `TRIGGER_SECRET_KEY` in your convex environment.
3. Install FFmpeg on your machine
4. Ensure all environment variables in src\trigger\.env.example are configured in your .env file to override the ones in development environment.
5. run pnpm dev:trigger to sync your local changes to dev environment

If you get ffmpeg errors, you can debug by running ffmpeg commands in your terminal. You should get more in-depth errors there.

# Auth Assignment API

A secure authentication API built with **Next.js (App Router)** and **Supabase Auth**. It handles user sign up, login, and logout, and protects specific routes using JWT bearer tokens issued by Supabase.

This project was built as part of the FlyRank AI Internship "Auth — Login & Protect" assignment.

## What this project does

- Registers and authenticates users through Supabase Auth (email + password).
- Issues JWT access tokens and refresh tokens on login.
- Verifies bearer tokens on protected routes using `supabase.auth.getUser(token)`.
- Extracts token verification into a single reusable middleware function (`verifyAuth`) shared across all protected routes.
- Documents every route in Swagger UI with a working "Authorize" bearer token flow.

## Tech stack

- Next.js 15+ (App Router, Route Handlers)
- TypeScript
- `@supabase/supabase-js`
- `swagger-ui-express` style OpenAPI docs served at `/docs`

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Himanshu-Dhawale/auth-assignment.git
cd auth-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Supabase project

- Go to [supabase.com](https://supabase.com) and create a free project.
- Go to **Project Settings → API** and copy your **Project URL** and **anon/publishable key**.

### 4. Environment variables

Create a `.env` file in the **project root** (same level as `package.json`) with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

> ⚠️ `.env` is already listed in `.gitignore` — never commit real Supabase keys.

If you're testing locally and don't want to deal with email confirmation delays, you can turn off **"Confirm email"** under **Authentication settings** in your Supabase dashboard. This is fine for local dev; keep it on for production.

## Running the project

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

Swagger UI (interactive API docs) is available at:

```
http://localhost:3000/docs
```

## API Reference

| Method | Route                  | Description                        | Auth Required |
|--------|-------------------------|-------------------------------------|----------------|
| POST   | `/auth/signup`          | Register a new user                 | No             |
| POST   | `/auth/login`            | Log in and receive access/refresh tokens | No        |
| POST   | `/auth/logout`           | Log out the current user            | Yes (Bearer token) |
| GET    | `/public/info`           | Public, unauthenticated info        | No             |
| GET    | `/protected/profile`     | Get the authenticated user's profile | Yes (Bearer token) |
| GET    | `/protected/dashboard`   | Example second protected route      | Yes (Bearer token) |

### Status codes used

| Code | Meaning                                              |
|------|-------------------------------------------------------|
| 200  | Successful login / read                               |
| 201  | User created (signup)                                 |
| 204  | Logout successful, no content returned                |
| 400  | Missing/invalid input, or signup error                |
| 401  | Missing, malformed, or invalid/expired bearer token; or wrong login credentials |

## Example usage

**Sign up**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourpassword"}'
```

**Log in**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourpassword"}'
```

**Access a protected route**
```bash
curl http://localhost:3000/protected/profile \
  -H "Authorization: Bearer <access_token>"
```

## Swagger UI

Protected routes are marked with a lock icon and can be tested directly from the browser after clicking **Authorize** and pasting a valid access token.

(<img width="1438" height="823" alt="image" src="https://github.com/user-attachments/assets/97670067-c259-4b09-8567-32a90caff9d0" />

)

## Known limitation — `POST /auth/logout`

Worth documenting honestly: `supabase-js`'s current `auth.signOut()` method does not accept a raw access token as an argument (the assignment brief's original wording, `signOut(token)`, reflects an older/admin-style API). In the modern client SDK, `signOut()` acts on whatever session the *client instance itself* is holding — which doesn't map cleanly onto a stateless server route where each request is independent and only carries an access token (not a full session).

As implemented here, `/auth/logout` verifies the incoming token is valid (via the same `verifyAuth` middleware used elsewhere) before calling `signOut()`, and correctly returns `204` on success. However, this does **not** guarantee the specific access token passed in is cryptographically invalidated — Supabase JWTs remain valid until their natural expiry regardless of a `signOut()` call, since they're stateless and self-verifying by design. A production system that needs immediate token revocation would need a token blocklist, short-lived access tokens with rotation, or the Supabase Admin API's server-side session revocation.

## Project structure

```
app/
  auth/
    signup/route.ts
    login/route.ts
    logout/route.ts
  protected/
    profile/route.ts
    dashboard/route.ts
  public/
    info/route.ts
  lib/
    supabase.ts     # Supabase client
    verifyAuth.ts    # Shared token-verification middleware
```

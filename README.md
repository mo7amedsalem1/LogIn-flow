# Secure Auth Platform

Production-oriented full-stack authentication system with:

- Node.js + Express backend
- PostgreSQL + Prisma ORM
- bcrypt password hashing
- TOTP 2FA with QR onboarding
- JWT authentication
- RBAC for `ADMIN`, `MANAGER`, and `USER`
- React + Vite frontend with protected routes and role-aware dashboards

## Folder structure

```text
.
|-- backend
|   |-- prisma
|   |   `-- schema.prisma
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- routes
|   |   |-- services
|   |   `-- utils
|   |-- .env.example
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- components
|   |   |-- context
|   |   |-- pages
|   |   |-- routes
|   |   |-- services
|   |   `-- utils
|   |-- .env.example
|   `-- package.json
`-- docker-compose.yml
```

## Frontend environment

Copy [frontend/.env.example](/C:/Users/Lenovo/Desktop/LogIn%20flow/frontend/.env.example) to `frontend/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Step-by-step setup

1. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create the Prisma migration and generate the client:

   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:generate
   ```

4. Start the backend:

   ```bash
   npm run dev
   ```

5. Install frontend dependencies in a new terminal:

   ```bash
   cd frontend
   npm install
   ```

6. Start the frontend:

   ```bash
   npm run dev
   ```

7. Open the Vite URL, usually `http://localhost:5173`.

## How the frontend connects to the backend

- The frontend uses Axios in [frontend/src/services/api.js](/C:/Users/Lenovo/Desktop/LogIn%20flow/frontend/src/services/api.js).
- `VITE_API_URL` defaults to `http://localhost:5000/api`.
- Axios adds `Authorization: Bearer <token>` automatically when a JWT exists.
- Protected pages use [frontend/src/components/PrivateRoute.jsx](/C:/Users/Lenovo/Desktop/LogIn%20flow/frontend/src/components/PrivateRoute.jsx) and [frontend/src/components/RoleRoute.jsx](/C:/Users/Lenovo/Desktop/LogIn%20flow/frontend/src/components/RoleRoute.jsx).

## API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-2fa`
- `GET /api/auth/me`
- `GET /api/profile`
- `GET /api/admin`
- `GET /api/manager`
- `GET /health`

## System flow

1. A user registers from the frontend.
2. The backend hashes the password with bcrypt.
3. The backend generates a TOTP secret, encrypts it at rest, and returns a QR code.
4. The user scans the QR code in an authenticator app.
5. The user logs in with email and password.
6. The backend returns a short-lived pre-2FA token.
7. The user submits a 6-digit TOTP code.
8. The backend verifies the TOTP and issues a JWT.
9. The frontend stores the JWT and hydrates the user session.
10. Protected and role-based routes become available.

## Demonstration checklist

- Register a new user and confirm the QR code appears.
- Log in with email and password.
- Verify the 2FA code.
- Confirm the JWT is stored in local storage under `secure_auth_access_token`.
- Open `/dashboard`, `/profile`, `/manager`, and `/admin` based on the account role.
- Confirm unauthorized routes redirect to `/unauthorized`.
- Confirm unauthorized API access returns `401` or `403`.

## Security notes

- Passwords are hashed with bcrypt before storage.
- TOTP secrets are encrypted with AES-256-GCM before being saved.
- JWTs are issued only after successful 2FA verification.
- Access tokens and pre-2FA tokens use separate secrets.
- JWT middleware verifies token integrity, then fetches the current user from the database.
- Rate limiting is applied to registration, login, 2FA verification, and general API traffic.
- Helmet and restrictive CORS are enabled on the backend.
- Elevated self-registration is protected with invite codes for `MANAGER` and `ADMIN`.
- Validation is enforced with Zod on incoming auth payloads.

## Notes for production hardening

- Move JWT storage from local storage to httpOnly secure cookies if you control the frontend and backend origin.
- Rotate the invite codes, encryption key, and JWT secrets before production deployment.
- Add refresh tokens, audit logging, and account recovery workflows if your product requires them.
- Replace open role selection with admin-managed provisioning if public sign-up is exposed to the internet.

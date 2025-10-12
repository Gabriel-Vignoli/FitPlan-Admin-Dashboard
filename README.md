# FitPlan Admin Dashboard

Administration dashboard for FitPlan built with Next.js, Prisma and AWS S3 for media uploads.

## Contents

- Quick start
- Prerequisites
- Environment variables
- Running
- Building for production
- Troubleshooting
- Notes about date input mask and validations

## Quick start

1. Clone the repository and open it:

   ```powershell
   git clone <repo-url> .
   cd admin-dashboard
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create a `.env` file in the project root (see example below).

4. Generate Prisma client (postinstall runs this automatically):

   ```powershell
   npx prisma generate
   ```

5. Start the dev server:

   ```powershell
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

## Prerequisites

- Node.js (18+ recommended)
- npm (or pnpm/yarn if you prefer)
- A PostgreSQL-compatible database (the project uses Neon in examples)
- AWS S3 bucket and IAM credentials with PutObject and HeadBucket permissions

## Environment variables (.env)

Create a `.env` file in the project root. Example values (do NOT commit secrets):

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_SECRET="super-secret"

AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=sa-east-1

RESEND_API_KEY=re_...
NODE_ENV="development"
```

Notes:

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` must match IAM credentials that can access the bucket.
- Ensure the `AWS_REGION` matches the bucket region.

## Running the app

- Dev: `npm run dev`
- Build: `npm run build`
- Start (production): `npm run start`
- Lint: `npm run lint`

## API endpoints

- `GET /api/alunos` - list students (pagination & search)
- `POST /api/alunos` - create student (expects JSON)
- `PUT /api/alunos/:id` - update student
- `GET /api/exercises` - list exercises (pagination & search)
- `POST /api/exercises` - create exercise (multipart/form-data with optional `image` and `video` files)

Refer to code in `src/app/api` for full details.

## Troubleshooting - AWS S3 SignatureDoesNotMatch

If you see `SignatureDoesNotMatch` when uploading to S3 (`POST /api/exercises`), check:

1. AWS credentials: ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct and have permissions for the bucket.
2. Region: `AWS_REGION` must match the bucket's region.
3. System clock: ensure the server's clock is close to real time. Large clock skew can break AWS signature validation.
4. Bucket name and request path: confirm `AWS_BUCKET_NAME` is correct and the code uses consistent object keys (this project uploads to `uploads/` in S3).

## Date input and validation

The UI expects birth dates in Brazilian format `dd/mm/yyyy` (masked on the Add/Edit student dialogs). The API receives `birthDate` as an ISO `yyyy-mm-dd` string converted from the validated user input. Validation rules:

- Format must be `dd/mm/yyyy`.
- Date cannot be in the future.
- Age cannot be greater than 100 years.

## Notes

- Prisma schema and migrations live in `prisma/`.
- S3 client config is in `config/aws.ts`.
- Date mask and validation were added to `src/components/CreateAlunoDialog.tsx` and `src/components/EditAlunoDialog.tsx`.

If you'd like, I can also:

- Add unit tests for the `validateBirthDateBR` function.
- Add automated checks to the CI pipeline for lints and tests.

---

If you want any section expanded, say which area and I'll update the README.

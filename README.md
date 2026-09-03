This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# TSWL Investor Site

## Secure investor portal

The private `/login`, `/statement`, and `/admin` routes use Firebase Authentication,
Firebase ID tokens, and Firestore security rules. Administrator access is granted
through protected `admins/{uid}` documents, with Firestore rules acting as the
final authorization layer.
They are intentionally absent from the public presentation flow and navigation.
Browser sessions use Firebase Web Authentication with local persistence; the
application does not create or validate server-side session cookies.

1. Copy `.env.example` to `.env.local` and populate the Firebase Web SDK values.
2. In Firebase Authentication, enable Email/Password sign-in and configure the
   authorised production domain.
3. Deploy Firestore rules and indexes with `firebase deploy --only firestore`.
4. Create the administrator in Firebase Authentication manually.
5. Copy the administrator's Authentication UID.
6. In Firestore, create `admins/{uid}` using that exact UID as the document ID,
   with:

   - `role`: `"admin"`
   - `active`: `true`
   - `email`: the administrator email

7. Restart or redeploy the app after setting production environment variables.

The invitation-only activation and authenticated account-linking routes use the
Firebase Admin SDK. Local Google Cloud Application Default Credentials are
supported. On Vercel, configure the server-only service-account variables listed
below. Never commit `.env.local`, service-account JSON, or investor data.

### Vercel environment variables

Set these Firebase Web SDK identifiers for Production, Preview, and Development
as appropriate:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_WIF_AUDIENCE
GOOGLE_SHEETS_DASHBOARD_URL
```

These values identify the Firebase web app and are expected to be browser-visible.
The three `FIREBASE_ADMIN_*` values and `GOOGLE_SHEETS_DASHBOARD_URL` are
server-only and must not use the `NEXT_PUBLIC_` prefix. Production Firebase Admin
access uses Vercel OIDC with Google Cloud Workload Identity Federation. Set
`FIREBASE_ADMIN_WIF_AUDIENCE` to the provider's default audience URL; no
service-account private key is stored. Local development may use Google
Application Default Credentials when the workload identity audience is absent.

### Google Sheets dashboard summary

The administrator dashboard reads only Total Invested from `Dashboard!A5` in
spreadsheet `1RF4m15_O5SrlvJTw4PgJZ7uw1ckAK-8c2OfcldEofPw`. `A5` is the
top-left cell of the merged `A5:B5` range. The script does not modify the
spreadsheet.

Total Capitalization (£750,000) and Operational Cost Per Week (£105,000) are
fixed portal values. Capital Remaining and Capital Raise Progress are
calculated from Total Invested. Total Gross Box Office and Total Net Box Office
are calculated from the saved Leeds, Hull and London Firestore totals using the
portal's theatre rules.

To deploy the read-only endpoint:

1. Open the spreadsheet and select **Extensions → Apps Script**.
2. Replace the editor contents with
   [`scripts/google-sheets-dashboard.gs`](scripts/google-sheets-dashboard.gs).
3. Select **Deploy → New deployment → Web app**.
4. Set **Execute as** to **Me** and **Who has access** to **Anyone**. The script
   reads only `Dashboard!A5` and does not write to the spreadsheet.
5. Deploy, authorize the script when prompted, and copy the `/exec` web-app URL.
6. Set that URL as `GOOGLE_SHEETS_DASHBOARD_URL` in Vercel for the required
   environments, then redeploy the site.

Do not commit the deployed Apps Script URL or expose it through a
`NEXT_PUBLIC_` variable.

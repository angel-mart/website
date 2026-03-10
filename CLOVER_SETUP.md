# Clover Payment — Setup & Deploy Guide

## 1. Get Your Clover Credentials

### Sandbox (Testing)
1. Go to https://sandbox.dev.clover.com/developer-home/create-account
2. Create a developer account and a test merchant
3. From the dashboard, get:
   - **Merchant ID** (shown in the URL: `/merchants/XXXXXX`)
   - **API Token**: Dashboard → Settings → API Tokens → Create token
   - **Public Key**: Dashboard → Your App → Ecommerce API Keys → Public Key

### Production
1. Go to https://www.clover.com → log in as merchant
2. Dashboard → Account & Setup → Ecommerce API

---

## 2. Set Environment Variables

Edit `.env.local` in the project root:

```
VITE_CLOVER_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxxxxxx
VITE_CLOVER_ENV=sandbox          # change to "production" when live
VITE_CHARGE_FUNCTION_URL=https://us-central1-angel-mart-e9bfa.cloudfunctions.net/cloverCharge
```

---

## 3. Deploy the Firebase Cloud Function

### Prerequisites
```bash
npm install -g firebase-tools
firebase login
firebase use angel-mart-e9bfa
```

### Set Clover secrets on the function
```bash
firebase functions:secrets:set CLOVER_API_TOKEN
# paste your Clover API token when prompted

firebase functions:secrets:set CLOVER_MERCHANT_ID
# paste your Clover merchant ID when prompted

firebase functions:secrets:set CLOVER_ENV
# type: sandbox   (or production)
```

### Install function dependencies & deploy
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

After deploy, Firebase will print the function URL. Paste it into `.env.local` as `VITE_CHARGE_FUNCTION_URL`.

---

## 4. Test with Sandbox Card Numbers

| Card Number         | Result   |
|---------------------|----------|
| 4111 1111 1111 1111 | Success  |
| 4000 0000 0000 0002 | Declined |

Use any future expiry date, any 3-digit CVV, any zip.

---

## 5. Go Live Checklist

- [ ] Switch `VITE_CLOVER_ENV=production` in `.env.local`
- [ ] Update `VITE_CLOVER_PUBLIC_KEY` to your production public key
- [ ] Update `CLOVER_API_TOKEN` secret to your production token
- [ ] Update `CLOVER_ENV` secret to `production`
- [ ] Re-deploy the Cloud Function
- [ ] Test with a real card for a small amount ($0.50)
- [ ] Confirm the charge appears in your Clover merchant dashboard

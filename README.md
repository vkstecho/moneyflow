# MoneyFlow

Personal finance tracker (PWA) – expenses, income, budgets, Needs/Wants/Savings, multi-account, SMS share import, PDF statements, ITR tools.

Modular static app ready for **GitHub Pages** or any static host.

## Folder structure

```
moneyflow/
├── index.html              # HTML shell only
├── css/
│   └── styles.css          # All styles (~39 KB)
├── js/
│   ├── config.js           # Firebase + PDF logos
│   ├── constants.js        # Categories, currencies, helpers
│   ├── auth.js             # Login, OTP, PIN, biometric
│   ├── data.js             # Storage, sync, accounts, goApp
│   ├── ui-core.js          # Home, history, budgets, reports, modals
│   ├── ui-itr.js           # Tax / earnings / cashback / HRA
│   ├── export.js           # PDF statement + PDF/JSON import
│   ├── settings.js         # Settings UI
│   └── init.js             # Boot, SW, share-target, PWA install
├── assets/
│   ├── icon.jpeg
│   ├── logo.jpeg
│   ├── mf-logo-pdf.jpeg
│   └── vks-logo-pdf.jpeg
├── manifest.json           # PWA + share target + shortcuts
├── sw.js                   # Offline shell cache
└── README.md
```

## Benefits of the split

| Before | After |
|--------|--------|
| Single ~260 KB HTML | Small HTML + separate CSS/JS |
| Any tweak re-downloads everything | Browser caches CSS & JS independently |
| Hard to navigate | One concern per file |

## Deploy to GitHub Pages

1. Create a repo (e.g. `moneyflow`).
2. Upload **everything inside** this `moneyflow/` folder to the **repo root** (or into `/docs`).
3. GitHub → **Settings → Pages** → Source: branch `main`, folder `/` (or `/docs`).
4. Visit `https://<you>.github.io/<repo>/`.

### Git commands

```bash
cd moneyflow
git init
git add .
git commit -m "MoneyFlow modular PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USER/moneyflow.git
git push -u origin main
```

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Firebase notes

Config is in `js/config.js`. For public repos:

- Restrict the API key by HTTP referrer in Firebase Console.
- Do not commit extra secrets.

## Features

- Phone OTP + Google sign-in · PIN / biometric
- Transactions (expense / income / transfer) · tags · receipts
- Multi-account balances
- Budgets · Needs / Wants / Savings
- Recurring bills · upcoming on Home
- SMS share-target parsing
- PDF statements · Axio-style PDF import · JSON backup
- Dark mode · multi-currency
- Private ITR / earnings / cashback / HRA section

## License

Use and modify for your projects. Keep attribution if redistributing publicly.

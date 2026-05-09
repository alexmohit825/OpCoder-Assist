# Op Coder Assist

**AI-powered operative report CPT & ICD-10 coding tool**  
Powered by OpenAI GPT-4o · 2026 AMA CPT Code Set · 2026 ICD-10-CM

---

## What It Does

Op Coder Assist reads every word of an operative report and returns:

- ✅ **2026 CPT codes** matched from the Procedures Performed section
- ✅ **ICD-10-CM diagnosis codes** from postoperative diagnoses
- ✅ **Work RVUs** (2026 CMS values) + estimated payment calculator
- ✅ **Body narrative validation** — confirms each code is documented
- ✅ **Modifiers** (-51, -59, -LT, -RT, -50, etc.)
- ✅ **NCCI bundling notes**
- ✅ **Surgeon-friendly summary** in plain English
- ✅ **CSV export** + copy-all

No data is stored. No login required. Each analysis is sent to OpenAI and the response is returned — nothing is saved.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Route (Node.js serverless) |
| AI Engine | OpenAI GPT-4o via official SDK |
| Deployment | Vercel (recommended) |

---

## Prerequisites

- **Node.js** 18.17 or higher ([nodejs.org](https://nodejs.org))
- **npm** 9+ or **yarn**
- **OpenAI API Key** ([platform.openai.com/api-keys](https://platform.openai.com/api-keys))
- **Vercel account** for deployment ([vercel.com](https://vercel.com)) — free tier works

---

## Local Development Setup

### 1. Unzip and enter the project

```bash
unzip opcoder-assist.zip
cd opcoder-assist
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel (Recommended — Creates Shareable Link)

Vercel gives you a public URL you can share with anyone.

### Step 1 — Push to GitHub

1. Create a new repository on [github.com](https://github.com)
2. Initialize and push:

```bash
cd opcoder-assist
git init
git add .
git commit -m "Initial commit — Op Coder Assist"
git remote add origin https://github.com/YOUR_USERNAME/opcoder-assist.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (free account works)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"** and select your `opcoder-assist` repo
4. Click **"Deploy"** — Vercel auto-detects Next.js

### Step 3 — Add Your OpenAI API Key to Vercel

This is the critical step that connects the AI engine.

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-your-actual-key-here`
   - **Environment:** Production, Preview, Development (check all three)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** (to pick up the new env var)

### Step 4 — Get Your Shareable URL

After deployment, Vercel gives you a URL like:

```
https://opcoder-assist-yourname.vercel.app
```

This URL is shareable with anyone — no login required.

---

## OpenAI API Key — Cost Estimates

Op Coder Assist uses **GPT-4o** by default.

| Report Length | Approx. Tokens | Approx. Cost per Analysis |
|--------------|---------------|--------------------------|
| Short (1 page) | ~2,000 tokens | ~$0.01 |
| Medium (2-3 pages) | ~4,000 tokens | ~$0.02 |
| Long (4+ pages) | ~8,000 tokens | ~$0.04 |

For a surgical practice running 20 reports/day: **~$0.20–$0.80/day**.

To use the cheaper **GPT-4o-mini** instead, add this to your `.env.local`:

```
OPENAI_MODEL=gpt-4o-mini
```

Note: GPT-4o provides significantly better medical coding accuracy. GPT-4o-mini is suitable for testing only.

---

## Project Structure

```
opcoder-assist/
├── app/
│   ├── layout.js                 # Root HTML layout
│   ├── globals.css               # Tailwind + custom styles
│   ├── page.js                   # Main application page
│   ├── api/
│   │   └── analyze/
│   │       └── route.js          # GPT-4o API endpoint (THE CORE ENGINE)
│   └── components/
│       ├── NavBar.js             # Top navigation
│       ├── InputPanel.js         # Report input + instructions
│       ├── ResultsPanel.js       # CPT/ICD-10 results display
│       └── Toast.js              # Copy confirmation notifications
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## The AI Coding Engine

The core logic lives in `app/api/analyze/route.js`.

The GPT-4o system prompt instructs the model to:

1. **Read the entire operative report** before assigning any codes
2. **Identify the Procedures Performed section** as the primary source
3. **Assign 2026 CPT codes** per procedure — accounting for approach, complexity, laterality, and add-ons
4. **Validate each code** against the body narrative (confirmed / partial / not confirmed)
5. **Assign ICD-10-CM codes** from postoperative diagnoses
6. **Apply modifiers** where clinically appropriate
7. **Check NCCI bundling** and flag potential edit pairs
8. **Return a surgeon-friendly summary** in plain English

The AI never codes from the Indications, History, or Preoperative Diagnosis sections — only from the Procedures Performed section, validated against the body.

---

## Customization

### Change the AI Model

In `.env.local` or Vercel Environment Variables:

```
OPENAI_MODEL=gpt-4o          # Best accuracy (default)
OPENAI_MODEL=gpt-4o-mini     # Lower cost, lower accuracy
```

### Modify the Coding Prompt

Edit the `SYSTEM_PROMPT` constant in `app/api/analyze/route.js` to adjust coding behavior, add specialty-specific instructions, or tune output format.

### Add Your Practice Name

Edit `app/components/NavBar.js` to add your practice name or logo.

---

## Security & HIPAA Notes

- **No data is stored** — operative reports are sent to OpenAI and the response is returned. Nothing is saved to any database.
- **OpenAI data usage:** By default, OpenAI does not use API data to train models. See [OpenAI's Privacy Policy](https://openai.com/policies/privacy-policy).
- **For HIPAA compliance:** Consider de-identifying reports (remove patient name, DOB, MRN) before submission, or enter a **Business Associate Agreement (BAA)** with OpenAI via their Enterprise tier.
- Your API key is stored securely as a Vercel environment variable and is never exposed to the browser.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| "Invalid API key" error | Check `OPENAI_API_KEY` in Vercel env vars. Redeploy after adding. |
| "Rate limit" error | You've hit OpenAI's rate limit. Wait 60 seconds and retry. |
| Analysis returns empty | Ensure the report has a clearly labeled "Procedures Performed" section |
| Slow response | Normal for long reports — GPT-4o can take 15-30 seconds for detailed notes |
| Build fails on Vercel | Run `npm run build` locally first to catch errors |

---

## Disclaimer

Op Coder Assist is an AI-assisted coding tool for informational purposes only.  
Always verify codes with a **Certified Professional Coder (CPC)**.  
Not a substitute for professional medical billing advice.  
CPT codes are copyright © American Medical Association.

---

*Op Coder Assist — Built for surgical practices that demand accuracy.*

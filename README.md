````markdown
# Smart Travel Scout

Smart Travel Scout is a **Next.js** web application that helps users discover the best travel experiences using AI-powered search. Users can enter natural-language queries (e.g., "beach under $100") and get curated recommendations from a predefined inventory. The AI provides clear reasoning behind each suggestion, ensuring results are grounded in the inventory only.  

This project was created as part of a technical assessment to demonstrate full-stack development, AI integration, and UX design.

---

## Features

- AI-powered search using **OpenAI GPT-4o-mini**
- Budget filters (min/max price) and category filters (beach, hiking, history, etc.)
- Sorted results by price or name
- Clear reasoning for each match: tags, location, price
- Responsive UI with **Tailwind CSS**
- Smooth animations and category tabs
- Fully deployed on [Vercel](https://vercel.com)

---

## Getting Started

### Prerequisites

- Node.js 18+ or compatible
- npm, yarn, or pnpm

### Installation

Clone the repository:  
```bash
git clone https://github.com/YOUR_USERNAME/Smart-Travel-Scout.git
cd Smart-Travel-Scout
````

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser. The page auto-updates as you edit `app/page.tsx`.

---

## Deployment

This project is deployed on **Vercel**. To deploy:

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Add an environment variable `OPENAI_API_KEY` with your OpenAI key.
4. Deploy — the app will be live at your Vercel URL.

---

## Project Structure

```
smart-travel-scout/
├─ app/                 # Next.js pages and components
│  ├─ page.tsx          # Main UI page
│  └─ api/search/route.ts # AI & keyword search API
├─ public/lib/data.ts    # Travel inventory data
├─ public/assets/        # Travel images
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## How It Works

1. User enters a query in natural language (e.g., "surfing beach under $100").
2. API extracts budget and keywords, then:

   * Sends query to GPT-4o-mini for AI matching **grounded in the inventory**.
   * Falls back to keyword-based search if AI fails.
3. Matches are scored, sorted, and returned with a short explanation (“Why this matches”).
4. Results are displayed in a responsive grid with images, price, and reason.

---

## Submission Answers

### 1. The "Under the Hood" Moment

**Technical Hurdle:** Integrating the AI API to parse user queries while ensuring it only returned items from the inventory.
**Solution:** I used a system prompt that strictly listed allowed IDs and included schema validation using **Zod**. If the AI returned invalid IDs or malformed data, the system discarded them and fell back to keyword search. Debugging involved inspecting API responses and logging parsed results.

### 2. The Scalability Thought

With **50,000 travel packages**, sending all data to the AI would be expensive and slow.
**Approach:** Precompute embeddings for all items and perform a **top-k retrieval** before calling the LLM. Only send relevant candidates to the model to reduce token usage. Post-processing ensures output is filtered by valid IDs.

### 3. The AI Reflection

**AI tool used:** OpenAI GPT-4o-mini via the OpenAI Node SDK.
**Issue:** Initially, the AI returned some non-existent IDs.
**Correction:** I enforced a strict JSON schema with Zod and filtered out any ID not in the inventory before displaying results.

---


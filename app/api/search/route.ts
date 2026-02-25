/**
 * Dataset extended beyond base requirement to test ranking logic
 * and simulate realistic inventory scale.
 * System works identically with the original dataset.
 */

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { TRAVEL_DATA, TravelItem } from "../../../public/lib/data";

interface SearchParams {
  query: string;
  minPrice: number | null;
  maxPrice: number | null;
}

interface AIMatch {
  id: number;
  reason?: string;
}

const MAX_RESULTS = 4;
const validIds = new Set(TRAVEL_DATA.map(item => item.id));

const MatchSchema = z.object({
  matches: z.array(
    z.object({
      id: z.number(),
      reason: z.string().optional()
    })
  )
});

const keywordMatches: Record<string, number[]> = {
  beach: [4], surf: [4], surfing: [4], chill: [4], young: [4], arugam: [4],
  history: [2,5], culture: [2], walking: [2], fort: [2], galle: [2],
  cold: [1], nature: [1,6], hiking: [1,6], tea: [1], nuwara: [1], eliya: [1],
  animals: [3], adventure: [3], safari: [3], yala: [3], wildlife: [3],
  climbing: [5], sigiriya: [5], ancient: [5], view: [5], ella: [6], sunrise: [6],
};

function extractBudget(query: string) {
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  const lower = query.toLowerCase();

  const maxMatch = lower.match(/under\s*\$?(\d+)|maximum\s*\$?(\d+)/i);
  if (maxMatch) maxPrice = parseInt(maxMatch[1] || maxMatch[2]);

  const minMatch = lower.match(/minimum\s*\$?(\d+)|over\s*\$?(\d+)/i);
  if (minMatch) minPrice = parseInt(minMatch[1] || minMatch[2]);

  return { minPrice, maxPrice };
}

export async function POST(req: NextRequest) {
  try {
    let searchBody: SearchParams = { query: "", minPrice: null, maxPrice: null };

    try {
      const rawBody = await req.json();
      searchBody = {
        query: rawBody.query?.toString()?.trim() || "",
        minPrice: typeof rawBody.minPrice === "number" ? rawBody.minPrice : null,
        maxPrice: typeof rawBody.maxPrice === "number" ? rawBody.maxPrice : null,
      };
    } catch {
      console.log("No JSON body, using defaults");
    }

    let { query, minPrice, maxPrice } = searchBody;
    const hasQuery = query.length > 0;
    const extracted = extractBudget(query);
    minPrice ??= extracted.minPrice;
    maxPrice ??= extracted.maxPrice;

    console.log("🔍 API:", { query, minPrice, maxPrice });

    if (!hasQuery) {
      let results = [...TRAVEL_DATA];

      if (minPrice !== null || maxPrice !== null) {
        results = results
          .filter(item =>
            (minPrice === null || item.price >= minPrice) &&
            (maxPrice === null || item.price <= maxPrice)
          )
          .map(item => ({
            ...item,
            reason: `Price: $${item.price}`
          }));
      }

      return NextResponse.json({ results });
    }

    if (process.env.OPENAI_API_KEY) {
      const aiResults = await tryAI(query, minPrice, maxPrice);
      if (aiResults && aiResults.length > 0) {
        return NextResponse.json({ results: aiResults });
      }
    }

    return smartKeywordSearch(query, minPrice, maxPrice);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ results: TRAVEL_DATA });
  }
}

async function tryAI(
  query: string,
  minPrice: number | null,
  maxPrice: number | null
): Promise<TravelItem[] | null> {

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const priceContext =
      (minPrice !== null || maxPrice !== null)
        ? `Budget: $${minPrice ?? ""}${minPrice !== null && maxPrice !== null ? "-" : ""}$${maxPrice ?? ""}`
        : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Smart Travel Scout.

STRICT RULES:
- You may ONLY return destinations from this inventory:
${JSON.stringify(TRAVEL_DATA)}

- Allowed IDs: ${TRAVEL_DATA.map(i => i.id).join(", ")}
- Return MAXIMUM ${MAX_RESULTS} matches
- Never invent destinations or IDs
- Respect budget if provided
- Rank by relevance

Return ONLY JSON:
{
  "matches": [
    {"id": 1, "reason": "short explanation referencing tags, price, or location"}
  ]
}

Query: "${query}"
${priceContext}
`
        },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = MatchSchema.parse(JSON.parse(content));
    const matches: AIMatch[] = parsed.matches;

    const results = matches
      .filter(match => validIds.has(match.id))
      .map(match => {
        const item = TRAVEL_DATA.find(i => i.id === match.id)!;
        let reason = match.reason || "matched perfectly";

        if (minPrice !== null && item.price >= minPrice) reason += ` + >=$${minPrice}`;
        if (maxPrice !== null && item.price <= maxPrice) reason += ` + <=$${maxPrice}`;

        return { ...item, reason };
      })
      .filter(item =>
        (minPrice === null || item.price >= minPrice) &&
        (maxPrice === null || item.price <= maxPrice)
      )
      .slice(0, MAX_RESULTS);

    return results.length > 0 ? results : null;

  } catch {
    console.log("failed, using keywords");
    return null;
  }
}


function smartKeywordSearch(
  query: string,
  minPrice: number | null,
  maxPrice: number | null
): NextResponse {

  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scores: Record<number, { score: number; reason: string }> = {};
  const reasons: Record<number, string[]> = {};

  TRAVEL_DATA.forEach(item => {
    if (item.price < 0) return;
    if (minPrice !== null && item.price < minPrice) return;
    if (maxPrice !== null && item.price > maxPrice) return;

    let score = 0;
    const reasons: string[] = [];
    const itemText = `${item.title} ${item.location}`.toLowerCase();

    if (itemText.includes(query.toLowerCase())) {
      score += 20;
      reasons.push(item.location);
    }

    words.forEach(word => {

      if (keywordMatches[word]?.includes(item.id)) {
        score += 5;
        reasons.push(word);
      }

      if (item.tags.some(tag => tag.toLowerCase().includes(word))) {
        score += 4;
        reasons.push(`#${word}`);
      }

      if (itemText.includes(word)) score += 2;
    });

    if (score > 0) {
      let reason = reasons.slice(0, 3).join(", ") || "matches your vibe";
      if (minPrice !== null || maxPrice !== null) reason += ` + price filter`;
      scores[item.id] = { score, reason };
    }
  });

  const sortedResults = Object.entries(scores)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(([idStr]) => {
      const item = TRAVEL_DATA.find(i => i.id === +idStr)!;
      const data = scores[+idStr];
      return { ...item, reason: `Smart Scout: ${data.reason}` };
    });

  if (sortedResults.length === 0) {
    const fallback = TRAVEL_DATA
      .filter(item =>
        (minPrice === null || item.price >= minPrice) &&
        (maxPrice === null || item.price <= maxPrice)
      )
      .slice(0, MAX_RESULTS)
      .map(item => ({
        ...item,
        reason: "Try: beach surfing, cheap history, hiking ella"
      }));

    return NextResponse.json({ results: fallback });
  }

  return NextResponse.json({ results: sortedResults });
}
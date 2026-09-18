import { InvitationData } from "../types";

/**
 * Extracts clean initial for monogram from a name or nickname,
 * skipping common titles and honorifics.
 */
export function extractInitial(nick?: string, full?: string): string {
  const clean = (str?: string): string => {
    if (!str) return "";
    return str
      .trim()
      .replace(/^(Mal\.?|Alh\.?|Alhaji|Mallam|Dr\.?|Mr\.?|Mrs\.?|Engr\.?|Sheikh|Prince|Ustaz|Bar\.)\s+/i, "")
      .trim();
  };

  const nickClean = clean(nick);
  if (nickClean.length > 0) {
    const match = nickClean.match(/[a-zA-Z]/);
    if (match) return match[0].toUpperCase();
  }

  const fullClean = clean(full);
  if (fullClean.length > 0) {
    const match = fullClean.match(/[a-zA-Z]/);
    if (match) return match[0].toUpperCase();
  }

  return "";
}

/**
 * Derives the royal monogram from the couple's first letters (Groom & Bride).
 * If data.baroqueMonogram is explicitly set and non-empty, it honors that custom override.
 */
export function getCoupleMonogram(
  data: Partial<Pick<InvitationData, "groomName" | "groomNick" | "brideName" | "brideNick" | "baroqueMonogram">>
): string {
  if (data.baroqueMonogram && data.baroqueMonogram.trim().length > 0) {
    return data.baroqueMonogram.trim().toUpperCase();
  }

  const gInitial = extractInitial(data.groomNick, data.groomName) || "G";
  const bInitial = extractInitial(data.brideNick, data.brideName) || "B";

  return `${gInitial}${bInitial}`;
}

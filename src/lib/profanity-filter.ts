import { IDProfanityFilter, idFilter } from '@sideid/id-profanity-filter';

const filter = new IDProfanityFilter({
  fullWordCensor: false,
  detectLeetSpeak: true,
  useLevenshtein: true,
  detectSimilarity: true,
  maxLevenshteinDistance: 2,
});

export interface ProfanityCheckResult {
  isProfane: boolean;
  filteredText?: string;
  profaneWords?: string[];
}

export function checkProfanity(text: string): ProfanityCheckResult {
  const hasProfanity = filter.isProfane(text);

  if (!hasProfanity) {
    return { isProfane: false };
  }

  const analysis = filter.analyze(text);

  return {
    isProfane: true,
    filteredText: filter.filter(text).filtered,
    profaneWords: analysis.matches,
  };
}

export { filter, idFilter };

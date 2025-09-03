import { Party } from '../types';

export const calculateEncounterStrength = (party: Omit<Party, 'encounterStrength'>): number => {
  // Base ES calculation: 4 + (2 * level) per hero
  const baseES = party.heroCount * (4 + (2 * party.heroLevel));
  
  // Add ES for Victories: every 2 Victories = +1 hero's ES
  const victoryBonus = Math.floor(party.victories / 2) * (4 + (2 * party.heroLevel));
  
  return baseES + victoryBonus;
};

export const determineEncounterDifficulty = (partyES: number, encounterEV: number, partyLevel: number): 'trivial' | 'easy' | 'standard' | 'hard' | 'extreme' => {
  // Calculate one hero's ES based on actual party level
  const oneHeroES = 4 + (2 * partyLevel);
  const threeHeroES = oneHeroES * 3;
  
  if (encounterEV < partyES - oneHeroES) {
    return 'trivial';
  } else if (encounterEV < partyES) {
    return 'easy';
  } else if (encounterEV <= partyES + oneHeroES) {
    return 'standard';
  } else if (encounterEV <= partyES + threeHeroES) {
    return 'hard';
  } else {
    return 'extreme';
  }
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'trivial':
      return '#4ade80'; // green
    case 'easy':
      return '#22c55e'; // green-500
    case 'standard':
      return '#eab308'; // yellow
    case 'hard':
      return '#f97316'; // orange
    case 'extreme':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}; 
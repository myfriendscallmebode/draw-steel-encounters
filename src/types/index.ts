export interface Monster {
  id: string;
  name: string;
  types: string[];
  encounterValue: number;
  organization: 'minion' | 'horde' | 'platoon' | 'elite' | 'leader' | 'solo';
  role: 'ambusher' | 'artillery' | 'brute' | 'controller' | 'defender' | 'harrier' | 'hexer' | 'leader' | 'support' | 'mount' | 'solo';
  level: number;
}

export interface EncounterCreature {
  monster: Monster;
  quantity: number;
}

export interface Encounter {
  creatures: EncounterCreature[];
  totalEV: number;
  difficulty: 'trivial' | 'easy' | 'standard' | 'hard' | 'extreme';
}

export interface Party {
  heroCount: number;
  heroLevel: number;
  victories: number;
  encounterStrength: number;
} 
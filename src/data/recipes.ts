export type Recipe = {
  id: string;
  name: string;
  inputs: Record<string, number>;
  output: { item: string; quantity: number };
  description: string;
};

export const RECIPES: Recipe[] = [
  {
    id: 'thermalCore',
    name: 'Thermal Core',
    inputs: { basalt: 1, sulfur: 1 },
    output: { item: 'core', quantity: 1 },
    description: 'Combines basalt and sulfur into a core that boosts resonance.',
  },
  {
    id: 'temperedCore',
    name: 'Tempered Core',
    inputs: { core: 1, oil: 1 },
    output: { item: 'temperedCore', quantity: 1 },
    description: 'Stabilises a core with oil to extend resonance duration.',
  },
  {
    id: 'crystalCharm',
    name: 'Crystal Charm',
    inputs: { decorShard: 3 },
    output: { item: 'charm', quantity: 1 },
    description: 'A charm that increases Tortie\'s mood cap slightly.',
  },
];

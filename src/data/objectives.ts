export type Objective = {
  id: string;
  title: string;
  need: number;
  reward: { xp: number; items?: Record<string, number> };
  description?: string;
};

export const OBJECTIVES: Objective[] = [
  {
    id: 'keepHeat120',
    title: 'Keep the Sweet Heat',
    need: 120,
    reward: { xp: 40, items: { nettle: 1 } },
    description: 'Maintain Tortie\'s heat between 50 and 66 for two minutes total.',
  },
  {
    id: 'sing12',
    title: 'Chant Practice',
    need: 12,
    reward: { xp: 35, items: { basalt: 1 } },
    description: 'Sing any incantation 12 times.',
  },
  {
    id: 'craft2core',
    title: 'Forge Thermal Cores',
    need: 2,
    reward: { xp: 60, items: { oil: 1 } },
    description: 'Craft two Thermal Cores for Tortie\'s heart.',
  },
  {
    id: 'portal1m',
    title: 'Let It Hum',
    need: 60,
    reward: { xp: 60, items: { decorShard: 1 } },
    description: 'Keep resonance at 100% to let the portal hum for one minute total.',
  },
  {
    id: 'polish15',
    title: 'Shine the Shell',
    need: 15,
    reward: { xp: 45, items: { sulfur: 1 } },
    description: 'Polish Tortie\'s shell 15 times.',
  },
];

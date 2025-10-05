export type Stats = {
  heat: number;
  mood: number;
  flux: number;
  shell: number;
};

export type Inventory = Record<string, number>;

export type ProgressMap = Record<string, number>;

export type AchievementMap = Record<string, boolean>;

export type SaveV1 = {
  stats: Stats;
  resonance: number;
  xp: number;
  level: number;
  evo: number;
  inv: Inventory;
  progress: ProgressMap;
  ach: AchievementMap;
  decor: string[];
  habitat: string;
  lastTickISO: string;
};

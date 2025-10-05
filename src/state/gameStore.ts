import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BASELINE_TUNING, DEFAULT_FLUX_CAP, DEFAULT_HEAT_CAP, DEFAULT_MOOD_CAP, DEFAULT_SHELL_CAP, HEAT_TARGET_MAX, HEAT_TARGET_MIN, PORTAL_HUM_OBJECTIVE_ID, STORAGE_KEY } from '../constants';
import { clamp } from '../utils/math';
import { calculateResonance } from '../utils/resonance';
import { levelXpRequirement } from '../utils/levels';
import { OBJECTIVES } from '../data/objectives';
import { ACHIEVEMENTS } from '../data/achievements';
import { RECIPES } from '../data/recipes';
import type { AchievementMap, Inventory, ProgressMap, SaveV1, Stats } from './types';

const DEFAULT_STATE: Stats = {
  heat: 58,
  mood: 75,
  flux: 70,
  shell: 85,
};

const INITIAL_INVENTORY: Inventory = {
  nettle: 3,
  sulfur: 2,
  basalt: 1,
  oil: 1,
  core: 0,
  temperedCore: 0,
  decorShard: 0,
  charm: 0,
};

const objectiveNeeds = OBJECTIVES.reduce<Record<string, number>>((acc, obj) => {
  acc[obj.id] = obj.need;
  return acc;
}, {});

const achievementTargets = {
  shinyFriend: 20,
  emberChef: 10,
};

export type LogEntry = {
  id: string;
  message: string;
  createdAt: number;
};

export type GameState = {
  stats: Stats;
  resonance: number;
  xp: number;
  level: number;
  evolutionStage: number;
  ventLevel: number;
  moodCapBonus: number;
  portalHumSeconds: number;
  portalHumTotal: number;
  portalActive: boolean;
  lastTick: number;
  inventory: Inventory;
  objectivesProgress: ProgressMap;
  achievements: AchievementMap;
  incantationsSung: number;
  polishCount: number;
  petCount: number;
  coresCrafted: number;
  logs: LogEntry[];
  habitat: string;
  decor: string[];
  actions: {
    setVentLevel: (value: number) => void;
    tick: (now?: number) => void;
    pet: () => void;
    polish: () => void;
    feed: (item: string) => void;
    stoke: () => void;
    singIncantation: (spell: IncantationId) => void;
    craft: (recipeId: string) => void;
    reset: () => void;
    loadSave: (save: SaveV1) => void;
    flushLogs: () => void;
  };
};

export type IncantationId = 'CALDO_PACIS' | 'VENA_STABILIS' | 'COCHLEA_LUX' | 'PORTA_SUSURRUS';

type TickContext = {
  deltaSeconds: number;
};

const MAX_LOGS = 30;

const makeLog = (message: string): LogEntry => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  message,
  createdAt: Date.now(),
});

const pushLog = (logs: LogEntry[], message: string) => {
  logs.unshift(makeLog(message));
  if (logs.length > MAX_LOGS) {
    logs.length = MAX_LOGS;
  }
};

const ensureAchievement = (achievements: AchievementMap, id: string, logs: LogEntry[]) => {
  if (!achievements[id]) {
    achievements[id] = true;
    pushLog(logs, `Achievement unlocked: ${ACHIEVEMENTS.find((a) => a.id === id)?.title ?? id}`);
  }
};

const applyObjectiveProgress = (progress: ProgressMap, id: string, amount: number, logs: LogEntry[]) => {
  const current = progress[id] ?? 0;
  const need = objectiveNeeds[id];
  if (need === undefined) return;
  const next = Math.min(need, current + amount);
  if (next !== current) {
    progress[id] = next;
    if (next >= need) {
      pushLog(logs, `Objective complete: ${OBJECTIVES.find((o) => o.id === id)?.title ?? id}`);
    }
  }
};

const calculateShellDecay = (heat: number) => {
  if (heat < 38) return BASELINE_TUNING.shellDecayLowHeat;
  if (heat > 78) return BASELINE_TUNING.shellDecayHighHeat;
  return BASELINE_TUNING.shellDecayNormal;
};

const applyTick = (state: GameState, ctx: TickContext) => {
  const { deltaSeconds } = ctx;
  const stats = state.stats;
  const clampStat = (value: number) => clamp(value, 0, 100);

  const ventCooling = state.ventLevel * BASELINE_TUNING.maxVentCooling * deltaSeconds;
  const heatDelta = BASELINE_TUNING.ambientHeatGain * deltaSeconds - ventCooling;
  stats.heat = clampStat(stats.heat + heatDelta);

  stats.mood = clampStat(stats.mood - BASELINE_TUNING.moodDecay * deltaSeconds);
  stats.flux = clamp(stats.flux - BASELINE_TUNING.fluxDecay * deltaSeconds, 0, DEFAULT_FLUX_CAP);
  const shellDecayRate = calculateShellDecay(stats.heat);
  stats.shell = clamp(stats.shell - shellDecayRate * deltaSeconds, 0, DEFAULT_SHELL_CAP);

  state.resonance = calculateResonance(stats, { bonusMoodCap: state.moodCapBonus });

  const sweetHeat = stats.heat >= HEAT_TARGET_MIN && stats.heat <= HEAT_TARGET_MAX;
  if (sweetHeat) {
    applyObjectiveProgress(state.objectivesProgress, 'keepHeat120', deltaSeconds, state.logs);
  }

  if (state.resonance >= BASELINE_TUNING.portalHumThreshold) {
    state.portalActive = true;
    state.portalHumSeconds += deltaSeconds;
    state.portalHumTotal += deltaSeconds;
    state.xp += BASELINE_TUNING.portalXpPerSecond * deltaSeconds;
    applyObjectiveProgress(state.objectivesProgress, PORTAL_HUM_OBJECTIVE_ID, deltaSeconds, state.logs);
    if (state.resonance >= 95) {
      ensureAchievement(state.achievements, 'heatWhisperer', state.logs);
    }
    if (state.portalHumSeconds >= 10) {
      ensureAchievement(state.achievements, 'portalWhisper', state.logs);
    }
  } else {
    state.portalActive = false;
    state.portalHumSeconds = 0;
  }

  while (state.xp >= levelXpRequirement(state.level)) {
    state.xp -= levelXpRequirement(state.level);
    state.level += 1;
    state.stats.mood = clamp(state.stats.mood + 5, 0, DEFAULT_MOOD_CAP + state.moodCapBonus);
    state.stats.shell = clamp(state.stats.shell + 5, 0, DEFAULT_SHELL_CAP);
    pushLog(state.logs, `Tortie reached level ${state.level}!`);
  }

  if (state.logs.length > MAX_LOGS) {
    state.logs.length = MAX_LOGS;
  }
};

const saveToStorage = (state: GameState) => {
  if (typeof localStorage === 'undefined') return;
  const payload: SaveV1 = {
    stats: state.stats,
    resonance: state.resonance,
    xp: state.xp,
    level: state.level,
    evo: state.evolutionStage,
    inv: state.inventory,
    progress: state.objectivesProgress,
    ach: state.achievements,
    decor: state.decor,
    habitat: state.habitat,
    lastTickISO: new Date(state.lastTick).toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to persist save', err);
  }
};

const hydrateFromStorage = (): SaveV1 | null => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveV1;
  } catch (err) {
    console.warn('Failed to parse save', err);
    return null;
  }
};

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    stats: { ...DEFAULT_STATE },
    resonance: calculateResonance(DEFAULT_STATE),
    xp: 0,
    level: 1,
    evolutionStage: 0,
    ventLevel: 0.25,
    moodCapBonus: 0,
    portalHumSeconds: 0,
    portalHumTotal: 0,
    portalActive: false,
    lastTick: Date.now(),
    inventory: { ...INITIAL_INVENTORY },
    objectivesProgress: {},
    achievements: {},
    incantationsSung: 0,
    polishCount: 0,
    petCount: 0,
    coresCrafted: 0,
    logs: [makeLog('Tortie stirs awake in the Ember Nook.')],
    habitat: 'emberNook',
    decor: [],
    actions: {
      setVentLevel: (value: number) => {
        set((state) => {
          state.ventLevel = clamp(value, 0, 1);
        });
      },
      tick: (now?: number) => {
        set((state) => {
          const current = now ?? Date.now();
          const delta = Math.min(
            BASELINE_TUNING.offlineCatchupSeconds,
            Math.max(0, current - state.lastTick) / 1000,
          );
          if (delta <= 0) {
            state.lastTick = current;
            return;
          }
          applyTick(state as unknown as GameState, { deltaSeconds: delta });
          state.lastTick = current;
        });
        saveToStorage(get());
      },
      pet: () => {
        set((state) => {
          state.stats.mood = clamp(
            state.stats.mood + BASELINE_TUNING.pettingGainPerSecond * 2.5,
            0,
            DEFAULT_MOOD_CAP + state.moodCapBonus,
          );
          state.petCount += 1;
          ensureAchievement(state.achievements, 'firstPet', state.logs);
        });
        saveToStorage(get());
      },
      polish: () => {
        set((state) => {
          state.stats.shell = clamp(
            state.stats.shell + BASELINE_TUNING.polishRepair,
            0,
            DEFAULT_SHELL_CAP,
          );
          state.stats.mood = clamp(
            state.stats.mood + 4,
            0,
            DEFAULT_MOOD_CAP + state.moodCapBonus,
          );
          state.polishCount += 1;
          applyObjectiveProgress(state.objectivesProgress, 'polish15', 1, state.logs);
          if (state.polishCount >= achievementTargets.shinyFriend) {
            ensureAchievement(state.achievements, 'shinyFriend', state.logs);
          }
        });
        saveToStorage(get());
      },
      feed: (item: string) => {
        set((state) => {
          if ((state.inventory[item] ?? 0) <= 0) {
            pushLog(state.logs, `You do not have any ${item} to feed.`);
            return;
          }
          state.inventory[item] -= 1;
          switch (item) {
            case 'nettle':
              state.stats.mood = clamp(
                state.stats.mood + BASELINE_TUNING.nettleMoodGain,
                0,
                DEFAULT_MOOD_CAP + state.moodCapBonus,
              );
              break;
            case 'sulfur':
              state.stats.flux = clamp(
                state.stats.flux + BASELINE_TUNING.sulfurFluxGain,
                0,
                DEFAULT_FLUX_CAP,
              );
              break;
            case 'basalt':
              state.stats.flux = clamp(
                state.stats.flux + BASELINE_TUNING.basaltFluxGain,
                0,
                DEFAULT_FLUX_CAP,
              );
              break;
            case 'oil':
              state.stats.shell = clamp(
                state.stats.shell + BASELINE_TUNING.oilShellGain,
                0,
                DEFAULT_SHELL_CAP,
              );
              break;
            default:
              break;
          }
          pushLog(state.logs, `Fed Tortie some ${item}.`);
        });
        saveToStorage(get());
      },
      stoke: () => {
        set((state) => {
          if (state.stats.flux < BASELINE_TUNING.stokeCost) {
            pushLog(state.logs, 'Not enough flux to stoke the vents.');
            return;
          }
          state.stats.flux = clamp(
            state.stats.flux - BASELINE_TUNING.stokeCost,
            0,
            DEFAULT_FLUX_CAP,
          );
          state.stats.heat = clamp(
            state.stats.heat + BASELINE_TUNING.stokeHeatGain,
            0,
            DEFAULT_HEAT_CAP,
          );
          pushLog(state.logs, 'You stoke the ember vents.');
        });
        saveToStorage(get());
      },
      singIncantation: (spell: IncantationId) => {
        set((state) => {
          state.incantationsSung += 1;
          applyObjectiveProgress(state.objectivesProgress, 'sing12', 1, state.logs);
          switch (spell) {
            case 'CALDO_PACIS':
              state.stats.mood = clamp(
                state.stats.mood + 6,
                0,
                DEFAULT_MOOD_CAP + state.moodCapBonus,
              );
              state.stats.heat = clamp(state.stats.heat + 1.5, 0, DEFAULT_HEAT_CAP);
              pushLog(state.logs, 'The CALDO PACIS chant warms Tortie.');
              break;
            case 'VENA_STABILIS':
              state.stats.flux = clamp(state.stats.flux + 10, 0, DEFAULT_FLUX_CAP);
              pushLog(state.logs, 'VENA STABILIS floods Tortie with steady flux.');
              break;
            case 'COCHLEA_LUX':
              state.stats.shell = clamp(state.stats.shell + 8, 0, DEFAULT_SHELL_CAP);
              pushLog(state.logs, 'COCHLEA LUX brightens the shell.');
              break;
            case 'PORTA_SUSURRUS':
              state.resonance = clamp(state.resonance + 6, 0, 120);
              pushLog(state.logs, 'PORTA SUSURRUS whispers awaken the portal.');
              break;
          }
        });
        saveToStorage(get());
      },
      craft: (recipeId: string) => {
        set((state) => {
          const recipe = RECIPES.find((r) => r.id === recipeId);
          if (!recipe) {
            pushLog(state.logs, 'Unknown recipe.');
            return;
          }
          const canCraft = Object.entries(recipe.inputs).every(
            ([item, qty]) => (state.inventory[item] ?? 0) >= qty,
          );
          if (!canCraft) {
            pushLog(state.logs, 'Missing ingredients.');
            return;
          }
          for (const [item, qty] of Object.entries(recipe.inputs)) {
            state.inventory[item] -= qty;
          }
          state.inventory[recipe.output.item] =
            (state.inventory[recipe.output.item] ?? 0) + recipe.output.quantity;
          pushLog(state.logs, `Crafted ${recipe.name}.`);
          if (recipeId === 'thermalCore') {
            state.coresCrafted += 1;
            applyObjectiveProgress(state.objectivesProgress, 'craft2core', 1, state.logs);
            if (state.coresCrafted >= achievementTargets.emberChef) {
              ensureAchievement(state.achievements, 'emberChef', state.logs);
            }
            state.resonance = clamp(state.resonance + BASELINE_TUNING.coreResonanceBoost, 0, 120);
          }
          if (recipeId === 'temperedCore') {
            state.portalHumTotal += BASELINE_TUNING.temperedCoreDurationBonus;
            pushLog(state.logs, 'Tempered core extends the portal hum.');
          }
          if (recipeId === 'crystalCharm') {
            state.moodCapBonus += BASELINE_TUNING.charmMoodCapBonus;
            pushLog(state.logs, "Crystal charm lifts Tortie's mood ceiling.");
          }
        });
        saveToStorage(get());
      },
      reset: () => {
        set(() => ({
          stats: { ...DEFAULT_STATE },
          resonance: calculateResonance(DEFAULT_STATE),
          xp: 0,
          level: 1,
          evolutionStage: 0,
          ventLevel: 0.25,
          moodCapBonus: 0,
          portalHumSeconds: 0,
          portalHumTotal: 0,
          portalActive: false,
          lastTick: Date.now(),
          inventory: { ...INITIAL_INVENTORY },
          objectivesProgress: {},
          achievements: {},
          incantationsSung: 0,
          polishCount: 0,
          petCount: 0,
          coresCrafted: 0,
          logs: [makeLog('Tortie returns to a calm ember.')],
          habitat: 'emberNook',
          decor: [],
        }));
        saveToStorage(get());
      },
      loadSave: (save: SaveV1) => {
        set(() => ({
          stats: { ...save.stats },
          resonance: save.resonance,
          xp: save.xp,
          level: save.level,
          evolutionStage: save.evo,
          ventLevel: 0.25,
          moodCapBonus: 0,
          portalHumSeconds: 0,
          portalHumTotal: 0,
          portalActive: false,
          lastTick: (() => {
            const parsed = Date.parse(save.lastTickISO);
            return Number.isFinite(parsed) ? parsed : Date.now();
          })(),
          inventory: { ...save.inv },
          objectivesProgress: { ...save.progress },
          achievements: { ...save.ach },
          incantationsSung: 0,
          polishCount: save.progress?.polish15 ?? 0,
          petCount: save.ach?.firstPet ? 1 : 0,
          coresCrafted: save.progress?.craft2core ?? 0,
          logs: [makeLog('Save loaded from stasis.')],
          habitat: save.habitat,
          decor: [...save.decor],
        }));
        saveToStorage(get());
      },
      flushLogs: () => {
        set((state) => {
          state.logs = state.logs.slice(0, MAX_LOGS);
        });
      },
    },
  })),
);

// Hydrate from storage immediately when module is imported (client side only)
if (typeof window !== 'undefined') {
  const saved = hydrateFromStorage();
  if (saved) {
    const store = useGameStore.getState();
    store.actions.loadSave(saved);
    const last = Date.parse(saved.lastTickISO ?? '');
    if (!Number.isNaN(last)) {
      store.actions.tick(Date.now());
    }
  }
}

// periodic autosave fallback
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    saveToStorage(useGameStore.getState());
  });
}


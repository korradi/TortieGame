import { HEAT_IDEAL, HEAT_TARGET_MAX, HEAT_TARGET_MIN } from '../constants';
import { clamp } from './math';

export type CoreStats = {
  heat: number;
  mood: number;
  flux: number;
  shell: number;
};

export const calculateResonance = (stats: CoreStats, modifiers?: { bonusMoodCap?: number }) => {
  const moodCap = 100 + (modifiers?.bonusMoodCap ?? 0);
  const heatWindow = (HEAT_TARGET_MAX - HEAT_TARGET_MIN) / 2;
  const heatDeviation = Math.max(0, Math.abs(stats.heat - HEAT_IDEAL) - heatWindow);
  const heatPenalty = heatDeviation * 1.4;
  const moodRatio = stats.mood / moodCap;
  const fluxRatio = stats.flux / 100;
  const shellRatio = stats.shell / 100;
  const base = (moodRatio + fluxRatio + shellRatio) / 3 * 100;
  const bonuses =
    (stats.mood > 80 ? (stats.mood - 80) * 0.12 : 0) +
    (stats.shell > 85 ? (stats.shell - 85) * 0.08 : 0);
  return clamp(base + bonuses - heatPenalty, 0, 120);
};

import { LEVEL_XP_BASE, LEVEL_XP_GROWTH } from '../constants';

export const levelXpRequirement = (level: number) => LEVEL_XP_BASE + LEVEL_XP_GROWTH * Math.max(0, level - 1);

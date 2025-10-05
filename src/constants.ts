export const STORAGE_KEY = 'tortie-heart-of-ember-save-v1';

export const HEAT_TARGET_MIN = 50;
export const HEAT_TARGET_MAX = 66;
export const HEAT_IDEAL = (HEAT_TARGET_MIN + HEAT_TARGET_MAX) / 2;

export const BASELINE_TUNING = {
  ambientHeatGain: 0.35,
  maxVentCooling: 0.9,
  moodDecay: 0.06,
  pettingGainPerSecond: 0.6,
  fluxDecay: 0.16,
  shellDecayNormal: 0.06,
  shellDecayLowHeat: 0.24,
  shellDecayHighHeat: 0.4,
  polishRepair: 7,
  oilRepair: 12,
  stokeCost: 8,
  stokeHeatGain: 6,
  nettleMoodGain: 12,
  sulfurFluxGain: 14,
  basaltFluxGain: 30,
  oilShellGain: 18,
  coreResonanceBoost: 8,
  temperedCoreDurationBonus: 30,
  charmMoodCapBonus: 5,
  resonancePortalThreshold: 95,
  portalHumThreshold: 100,
  portalXpPerSecond: 1,
  offlineCatchupSeconds: 7200,
};

export const DEFAULT_MOOD_CAP = 100;
export const DEFAULT_FLUX_CAP = 100;
export const DEFAULT_SHELL_CAP = 100;
export const DEFAULT_HEAT_CAP = 100;

export const LEVEL_XP_BASE = 50;
export const LEVEL_XP_GROWTH = 40;

export const PORTAL_HUM_OBJECTIVE_ID = 'portal1m';

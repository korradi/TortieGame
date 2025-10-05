import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Panel from './components/Panel';
import StatBar from './components/StatBar';
import ActionButton from './components/ActionButton';
import { useGameStore } from './state/gameStore';
import { levelXpRequirement } from './utils/levels';
import { OBJECTIVES } from './data/objectives';
import { ACHIEVEMENTS } from './data/achievements';
import { RECIPES } from './data/recipes';
import type { IncantationId } from './state/gameStore';

const INCANTATIONS: { id: IncantationId; name: string; description: string }[] = [
  { id: 'CALDO_PACIS', name: 'Caldo Pacis', description: 'Warm chant boosting mood and heat slightly.' },
  { id: 'VENA_STABILIS', name: 'Vena StabilIS', description: 'Steady flux surge to fuel Tortie.' },
  { id: 'COCHLEA_LUX', name: 'Cochlea Lux', description: 'Radiant polish to reinforce the shell.' },
  { id: 'PORTA_SUSURRUS', name: 'Porta Susurrus', description: 'Gentle whisper nudging resonance upward.' },
];

const formatSeconds = (seconds: number) => `${Math.floor(seconds)}s`;

const TortieAvatar = ({ resonance }: { resonance: number }) => {
  const glow = Math.min(1, resonance / 100);
  const size = 220 + glow * 40;
  return (
    <motion.div
      className="tortie-avatar"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${50 + glow * 80}px rgba(255, 120, 60, ${0.2 + glow * 0.4})`,
      }}
      animate={{
        scale: 1 + glow * 0.05,
        rotate: [0, 1.5, 0, -1.5, 0],
      }}
      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
    >
      <div className="tortie-avatar__shell">
        <div className="tortie-avatar__shell__pattern" />
      </div>
      <motion.div
        className="tortie-avatar__eyes"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <div />
        <div />
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [showLore, setShowLore] = useState(false);
  const {
    stats,
    resonance,
    xp,
    level,
    ventLevel,
    moodCapBonus,
    inventory,
    objectivesProgress,
    achievements,
    logs,
    portalActive,
    portalHumTotal,
    actions,
  } = useGameStore((state) => ({
    stats: state.stats,
    resonance: state.resonance,
    xp: state.xp,
    level: state.level,
    ventLevel: state.ventLevel,
    moodCapBonus: state.moodCapBonus,
    inventory: state.inventory,
    objectivesProgress: state.objectivesProgress,
    achievements: state.achievements,
    logs: state.logs,
    portalActive: state.portalActive,
    portalHumTotal: state.portalHumTotal,
    actions: state.actions,
  }));

  useEffect(() => {
    const id = window.setInterval(() => actions.tick(), 1000);
    return () => window.clearInterval(id);
  }, [actions]);

  const xpNeed = useMemo(() => levelXpRequirement(level), [level]);

  useEffect(() => {
    if (resonance >= 95) {
      setShowLore(true);
    }
  }, [resonance]);

  const inventoryEntries = useMemo(
    () => Object.entries(inventory).filter(([, qty]) => qty > 0),
    [inventory],
  );

  return (
    <div className="app-shell">
      <main className="layout">
        <section className="layout__left">
          <div className="hero-card">
            <TortieAvatar resonance={resonance} />
            <div className="hero-card__info">
              <div className="hero-card__header">
                <h1>Tortie</h1>
                <p>Heart of Ember caretaker log</p>
              </div>
              <div className="hero-card__resonance">
                <StatBar label="Resonance" value={resonance} max={120} color="#ffb347" />
                <div className="hero-card__resonance__details">
                  <span>{resonance.toFixed(1)}%</span>
                  {portalActive ? <span className="portal-active">Portal humming…</span> : <span>Portal dormant</span>}
                </div>
              </div>
              <div className="hero-card__stats">
                <StatBar label="Heat" value={stats.heat} caption="Target 50-66" color="#ff7e5f" />
                <StatBar label="Mood" value={stats.mood} max={100 + moodCapBonus} color="#fbc2eb" />
                <StatBar label="Flux" value={stats.flux} color="#72c6ff" />
                <StatBar label="Shell" value={stats.shell} color="#b8ff72" />
              </div>
              <div className="hero-card__xp">
                <StatBar label={`Level ${level}`} value={xp} max={xpNeed} color="#ffd369" />
                <span>{xp.toFixed(0)} / {xpNeed} XP</span>
              </div>
            </div>
          </div>
          <Panel
            title="Ritual Console"
            headerExtras={(
              <div className="vent-control">
                <label htmlFor="vent">Vent</label>
                <input
                  id="vent"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ventLevel}
                  onChange={(e) => actions.setVentLevel(parseFloat(e.currentTarget.value))}
                />
              </div>
            )}
          >
            <div className="ritual-grid">
              <ActionButton onClick={actions.pet}>Pet Tortie</ActionButton>
              <ActionButton onClick={actions.polish}>Polish Shell</ActionButton>
              <ActionButton onClick={actions.stoke}>Stoke Vents</ActionButton>
              {['nettle', 'sulfur', 'basalt', 'oil'].map((item) => (
                <ActionButton key={item} onClick={() => actions.feed(item)} disabled={(inventory[item] ?? 0) <= 0}>
                  Feed {item} ({inventory[item] ?? 0})
                </ActionButton>
              ))}
            </div>
            <div className="incantations">
              {INCANTATIONS.map((spell) => (
                <button key={spell.id} className="incantation" onClick={() => actions.singIncantation(spell.id)}>
                  <strong>{spell.name}</strong>
                  <span>{spell.description}</span>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Forge">
            <ul className="recipe-list">
              {RECIPES.map((recipe) => {
                const canCraft = Object.entries(recipe.inputs).every(
                  ([item, qty]) => (inventory[item] ?? 0) >= qty,
                );
                return (
                  <li key={recipe.id}>
                    <div>
                      <strong>{recipe.name}</strong>
                      <p>{recipe.description}</p>
                      <span className="recipe-inputs">
                        Inputs:{' '}
                        {Object.entries(recipe.inputs)
                          .map(([item, qty]) => `${qty}× ${item}`)
                          .join(', ')}
                      </span>
                    </div>
                    <ActionButton onClick={() => actions.craft(recipe.id)} disabled={!canCraft}>
                      Craft
                    </ActionButton>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </section>
        <section className="layout__right">
          <Panel title="Inventory">
            {inventoryEntries.length === 0 ? (
              <p className="empty">No items yet. Complete rituals and objectives to earn more.</p>
            ) : (
              <ul className="inventory-list">
                {inventoryEntries.map(([item, qty]) => (
                  <li key={item}>
                    <span className="inventory-item">{item}</span>
                    <span className="inventory-qty">{qty}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Objectives">
            <ul className="objective-list">
              {OBJECTIVES.map((objective) => {
                const progress = objectivesProgress[objective.id] ?? 0;
                const ratio = Math.min(1, progress / objective.need);
                return (
                  <li key={objective.id}>
                    <div>
                      <strong>{objective.title}</strong>
                      <p>{objective.description}</p>
                    </div>
                    <div className="objective-progress">
                      <div className="objective-progress__bar">
                        <div style={{ width: `${ratio * 100}%` }} />
                      </div>
                      <span>
                        {progress.toFixed(0)} / {objective.need}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <Panel title="Achievements">
            <ul className="achievement-list">
              {ACHIEVEMENTS.map((achievement) => (
                <li key={achievement.id} className={achievements[achievement.id] ? 'achieved' : undefined}>
                  <strong>{achievement.title}</strong>
                  <p>{achievement.description}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel
            title="Dream Log"
            headerExtras={<button className="clear-logs" onClick={actions.flushLogs}>Trim</button>}
          >
            <ul className="log-list">
              {logs.map((log) => (
                <li key={log.id}>{log.message}</li>
              ))}
            </ul>
          </Panel>
        </section>
      </main>
      <AnimatePresence>
        {showLore ? (
          <motion.div
            className="lore-ribbon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p>
              Tortie hums of distant keys. Portal resonance held for {formatSeconds(portalHumTotal)}. Keep nurturing the ember to reveal more dream logs.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <footer className="footer">
        <button onClick={actions.reset}>Reset save</button>
      </footer>
    </div>
  );
}

export default App;

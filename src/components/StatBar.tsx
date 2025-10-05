import { FC } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  color?: string;
  caption?: string;
};

export const StatBar: FC<StatBarProps> = ({ label, value, max = 100, color = '#ff9472', caption }) => {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        <span className="stat-bar__label">{label}</span>
        <span className="stat-bar__value">{value.toFixed(0)}</span>
      </div>
      <div className="stat-bar__track">
        <motion.div
          layout
          className={clsx('stat-bar__fill')}
          style={{ width: `${ratio * 100}%`, background: color }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      {caption ? <div className="stat-bar__caption">{caption}</div> : null}
    </div>
  );
};

export default StatBar;

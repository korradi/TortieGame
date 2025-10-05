import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

type PanelProps = PropsWithChildren<{
  title?: string;
  className?: string;
  headerExtras?: React.ReactNode;
}>;

export const Panel: FC<PanelProps> = ({ title, children, className, headerExtras }) => (
  <section className={clsx('panel', className)}>
    {(title || headerExtras) && (
      <header className="panel__header">
        {title ? <h3>{title}</h3> : <span />}
        {headerExtras ? <div className="panel__extras">{headerExtras}</div> : null}
      </header>
    )}
    <div className="panel__body">{children}</div>
  </section>
);

export default Panel;

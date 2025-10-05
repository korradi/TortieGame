import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

export const ActionButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...rest }) => (
  <button
    className={clsx(
      'action-button',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

export default ActionButton;

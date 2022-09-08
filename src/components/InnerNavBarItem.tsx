import {ReactNode} from 'react';

interface InnerNavBarItemProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  active: boolean;
}
export const InnerNavBarItem = ({
  children,
  onClick,
  active,
}: InnerNavBarItemProps): JSX.Element => {
  console.log('Active', active);
  return (
    <div
      onClick={onClick}
      className={`bg-primary_light text-background px-4 py-2 rounded-md cursor-pointer ${
        active ? 'bg-secondary font-bold px-3' : ''
      }`}
    >
      {children}
    </div>
  );
};

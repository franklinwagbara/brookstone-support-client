import {ReactNode} from 'react';

interface InnerNavBarProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export const InnerNavBar = ({
  children,
  onClick,
}: InnerNavBarProps): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 border-secondary border-2 w-fit p-2 rounded-md `}
    >
      {children}
    </div>
  );
};

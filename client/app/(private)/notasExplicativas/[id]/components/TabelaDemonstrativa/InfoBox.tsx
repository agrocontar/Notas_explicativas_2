// src/components/TabelaDemonstrativa/InfoBox.tsx
import { ReactNode } from 'react';

interface InfoBoxProps {
  type: 'info' | 'warning';
  icon: string;
  title?: string;
  message: ReactNode;
}

export default function InfoBox({ type, icon, title, message }: InfoBoxProps) {
  const getColorClass = () => {
    switch (type) {
      case 'info': return 'bg-blue-50 text-blue-500';
      case 'warning': return 'bg-yellow-50 text-yellow-500';
      default: return 'bg-blue-50 text-blue-500';
    }
  };

  return (
    <div className={`${getColorClass()} p-3 border-round mt-3`}>
      <div className="flex align-items-center gap-2 mb-2">
        <i className={`${icon}`}></i>
        {title && <span className="font-semibold">{title}</span>}
      </div>
      <div>{message}</div>
    </div>
  );
}
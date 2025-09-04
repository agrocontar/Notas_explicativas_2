'use client';
import { Button } from 'primereact/button';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const ActionButton = ({ onClick, disabled, loading }: ActionButtonProps) => {
  return (
    <div className="col-12 md:col-2 flex align-items-center justify-content-center py-5">
      <Button 
        icon="pi pi-arrow-right-arrow-left" 
        onClick={onClick}
        tooltip="Relacionar contas selecionadas"
        tooltipOptions={{ position: 'bottom' }}
        className="p-button-lg w-full"
        disabled={disabled}
        loading={loading}
        label="de/para"
      />
    </div>
  );
};
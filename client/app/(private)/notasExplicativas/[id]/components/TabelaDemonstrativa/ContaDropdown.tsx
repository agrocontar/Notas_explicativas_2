// src/components/TabelaDemonstrativa/ContaDropdown.tsx
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ContaBalancete, TabelaDemonstrativa as TabelaType } from '../../types';

interface ContaDropdownProps {
  linha: TabelaType;
  contasBalancete: ContaBalancete[];
  loadingContas: boolean;
  onContaSelect: (id: string, codigoConta: string) => void;
}

export default function ContaDropdown({
  linha,
  contasBalancete,
  loadingContas,
  onContaSelect
}: ContaDropdownProps) {
  const contaTemplate = (option: ContaBalancete) => {
    return (
      <div className="flex flex-column">
        <span className="font-semibold">{option.codigo}</span>
        <span className="text-sm text-color-secondary">{option.nome}</span>
      </div>
    );
  };

  const selectedContaTemplate = (option: ContaBalancete, props: any) => {
    if (option) {
      return (
        <div className="flex flex-column">
          <span className="font-semibold">{option.codigo}</span>
          <span className="text-sm text-color-secondary">{option.nome}</span>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  // Se estiver carregando, mostrar um spinner desabilitado
  if (loadingContas) {
    return (
      <div className="flex align-items-center gap-2 w-full p-inputtext p-component p-disabled">
        <ProgressSpinner style={{ width: '20px', height: '20px' }} />
        <span>Carregando contas...</span>
      </div>
    );
  }

  return (
    <Dropdown
      value={contasBalancete.find(conta => conta.codigo === linha.conta) || null}
      options={contasBalancete}
      onChange={(e) => onContaSelect(linha.id!, e.value?.codigo || '')}
      optionLabel="nome"
      placeholder="Selecione uma conta"
      itemTemplate={contaTemplate}
      valueTemplate={selectedContaTemplate}
      className="w-full"
      filter
      filterBy="codigo,nome"
      showClear
      disabled={loadingContas}
    />
  );
}
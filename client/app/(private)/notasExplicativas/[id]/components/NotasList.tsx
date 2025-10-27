import { OrderList } from "primereact/orderlist";
import { NotaExplicativa } from "../types";

interface NotasListProps {
  notas: NotaExplicativa[];
  selectedNota: NotaExplicativa | null;
  onNotaSelect: (nota: NotaExplicativa) => void;
  onReorder: (event: any) => void;
}

export default function NotasList({ 
  notas, 
  selectedNota, 
  onNotaSelect, 
  onReorder 
}: NotasListProps) {
  
  const itemTemplate = (nota: NotaExplicativa) => {
    return (
      <div 
        className={`flex flex-column p-2 border-round cursor-pointer transition-colors transition-duration-200 ${
          selectedNota?.id === nota.id ? 'bg-blue-50 border-1 border-blue-200' : 'hover:bg-gray-50'
        }`}
        onClick={() => onNotaSelect(nota)}
      >
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-2 flex-1 min-w-0">
            <span className="flex-shrink-0 w-2rem h-2rem bg-primary border-circle text-white font-bold flex align-items-center justify-content-center text-sm">
              {nota.number}
            </span>
            <div className="flex flex-column flex-1 min-w-0">
              <span className="font-semibold text-sm truncate">{nota.title}</span>
              <span className="text-xs text-color-secondary truncate">
                Atualizada em: {new Date(nota.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <i className="pi pi-chevron-right text-color-secondary flex-shrink-0 ml-1 text-xs"></i>
        </div>
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center p-2">
        <span className="text-base font-bold truncate">Notas</span>
        <span className="text-color-secondary flex-shrink-0 ml-1 text-sm">{notas.length} notas</span>
      </div>
    );
  };

  return (
    <div className="col-12 lg:col-6 xl:col-5">
      <div className="card h-full">
        <OrderList
          value={notas}
          itemTemplate={itemTemplate}
          header={headerTemplate()}
          dragdrop
          dataKey="id"
          onChange={onReorder}
          listStyle={{ 
            maxHeight: '65vh',
            minHeight: '350px'
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { NotaExplicativa } from "../types";

interface NotaViewerProps {
  selectedNota: NotaExplicativa | null;
  onEdit: () => void;
  onDelete: (nota: NotaExplicativa) => void;
}

export default function NotaViewer({ selectedNota, onEdit, onDelete }: NotaViewerProps) {
  
  const handleDeleteClick = (nota: NotaExplicativa) => {
    confirmDialog({
      message: `Tem certeza que deseja deletar a nota "${nota.title}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => onDelete(nota),
      rejectClassName: 'p-button-secondary p-button-text',
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!selectedNota) {
    return (
      <div className="col-12 lg:col-6 xl:col-7 mt-3 lg:mt-0">
        <div className="card h-full">
          <div className="flex flex-column align-items-center justify-content-center text-center p-4" style={{ height: '350px' }}>
            <i className="pi pi-file text-4xl text-color-secondary mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">Nenhuma nota selecionada</h3>
            <p className="text-color-secondary text-sm mb-3">
              Selecione uma nota na lista ao lado para visualizar seu conteúdo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12 lg:col-6 xl:col-7 mt-3 lg:mt-0">
      <div className="card h-full">
        <ConfirmDialog />
        
        <div className="flex flex-column h-full">
          <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2 mb-3 pb-2 border-bottom-1 surface-border">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold m-0 truncate">{selectedNota.title}</h2>
              <span className="text-color-secondary text-xs">
                Nota {selectedNota.number} • 
                Atualizada: {new Date(selectedNota.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                className="p-button-outlined p-button-secondary p-button-sm"
                onClick={onEdit}
              />
              <Button
                icon="pi pi-trash"
                label="Deletar"
                className="p-button-outlined p-button-danger p-button-sm"
                onClick={() => handleDeleteClick(selectedNota)}
              />
            </div>
          </div>

          <div 
            className="flex-grow-1 overflow-auto prose max-w-none p-1 mb-3"
            style={{ 
              maxHeight: '40vh',
              minHeight: '150px'
            }}
            dangerouslySetInnerHTML={{ __html: selectedNota.content }}
          />

          {/* Tabela Demonstrativa na Visualização */}
          {selectedNota.tabelas && selectedNota.tabelas.length > 0 && (
            <div className="border-top-1 surface-border pt-3">
              <h4 className="font-semibold mb-2">Tabela Demonstrativa</h4>
              <div className="card">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="border-bottom-1 surface-border">
                      <th className="text-left p-2 font-semibold bg-gray-50">Conta</th>
                      <th className="text-right p-2 font-semibold bg-gray-50">Ano Anterior</th>
                      <th className="text-right p-2 font-semibold bg-gray-50">Ano Atual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedNota.tabelas.map((linha, index) => (
                      <tr key={index} className="border-bottom-1 surface-border">
                        <td className="p-2">{linha.conta || '-'}</td>
                        <td className="p-2 text-right">{formatCurrency(linha.anoAnterior)}</td>
                        <td className="p-2 text-right">{formatCurrency(linha.anoAtual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
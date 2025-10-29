import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";

interface CriarNotaModalProps {
  visible: boolean;
  onHide: () => void;
  onCreate: (titulo: string) => void;
  proximoNumero: number;
}

export default function CreateNotaModal({ 
  visible, 
  onHide, 
  onCreate,
  proximoNumero 
}: CriarNotaModalProps) {
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onCreate(titulo);
      setTitulo("");
      onHide();
    } catch (error) {
      console.error('Erro ao criar nota:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHide = () => {
    setTitulo("");
    onHide();
  };

  return (
    <Dialog
      header="Criar Nova Nota"
      visible={visible}
      style={{ width: '500px' }}
      onHide={handleHide}
      footer={
        <div className="flex flex-wrap gap-2 justify-content-end">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-sm"
            onClick={handleHide}
            disabled={loading}
          />
          <Button
            label="Criar"
            icon="pi pi-plus"
            className="p-button-primary p-button-sm"
            onClick={handleSubmit}
            loading={loading}
            disabled={!titulo.trim() || loading}
          />
        </div>
      }
    >
      <div className="flex flex-column gap-4">
        <div className="field">
          <label htmlFor="titulo" className="font-semibold block mb-2">
            Título da Nota *
          </label>
          <InputText
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Informações Gerais, Bases Contábeis..."
            className="w-full"
            autoFocus
          />
        </div>

        <div className="bg-blue-50 p-3 border-round text-sm">
          <div className="flex align-items-center gap-2 mb-2">
            <i className="pi pi-info-circle text-blue-500"></i>
            <span className="font-semibold">Informações:</span>
          </div>
          <ul className="m-0 pl-3">
            <li>Número da nota: <strong>{proximoNumero}</strong> (automático)</li>
            <li>A nota será criada em branco, você poderá editar o conteúdo posteriormente.</li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
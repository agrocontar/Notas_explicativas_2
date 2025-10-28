import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import dynamic from 'next/dynamic';
import { NotaExplicativa, TabelaDemonstrativa } from "../types";
import TabelaDemonstrativaComponent from "./TabelaDemonstrativa";
import { useState, useEffect } from 'react';

// Carregar ReactQuill dinamicamente
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="flex align-items-center justify-content-center p-4 text-base">Carregando editor...</div>
});

export interface NotaEditorProps {
  selectedNota: NotaExplicativa | null;
  visible: boolean;
  editTitle: string;
  editContent: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: (tabelasAtualizadas?: TabelaDemonstrativa[]) => void;
  onHide: () => void;
}

// Configuração do ReactQuill (fora do componente para evitar re-renders desnecessários)
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link'
];

export default function NotaEditor({
  selectedNota,
  visible,
  editTitle,
  editContent,
  onTitleChange,
  onContentChange,
  onSave,
  onHide
}: NotaEditorProps) {
  const [tabelas, setTabelas] = useState<TabelaDemonstrativa[]>([]);

  // Inicializa as tabelas quando a nota selecionada muda ou o dialog abre
  useEffect(() => {
    if (selectedNota && visible) {
      setTabelas(selectedNota.tabelas || []);
    }
  }, [selectedNota, visible]);

  const handleTabelasChange = (novasTabelas: TabelaDemonstrativa[]) => {
    setTabelas(novasTabelas);
  };

  const handleSave = () => {
    onSave(tabelas);
  };

  return (
    <Dialog
      header={`Editar Nota ${selectedNota?.number}`}
      visible={visible}
      style={{ 
        width: '95vw', 
        height: '95vh',
        maxWidth: '1200px'
      }}
      className="w-full max-w-6xl"
      onHide={onHide}
      footer={
        <div className="flex flex-wrap gap-2 justify-content-end">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-sm text-base"
            onClick={onHide}
          />
          <Button
            label="Salvar"
            icon="pi pi-check"
            className="p-button-primary p-button-sm text-base"
            onClick={handleSave}
          />
        </div>
      }
    >
      <div className="flex flex-column gap-4 h-full text-base" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="field">
          <label htmlFor="title" className="font-semibold block mb-2 text-lg">
            Título
          </label>
          <InputText
            id="title"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full p-inputtext-lg"
            style={{ fontSize: '1.1rem' }}
          />
        </div>

        <div className="field flex-grow-1 flex flex-column">
          <label htmlFor="content" className="font-semibold block mb-2 text-lg">
            Conteúdo
          </label>
          <div className="flex-grow-1" style={{ minHeight: '350px' }}>
            <ReactQuill
              value={editContent}
              onChange={onContentChange}
              modules={modules}
              formats={formats}
              theme="snow"
              style={{ 
                height: '350px',
                marginBottom: '50px',
                fontSize: '1.1rem'
              }}
            />
          </div>
        </div>

        {/* Seção da Tabela Demonstrativa */}
        {selectedNota && (
          <div className="border-top-1 surface-border pt-4">
            <TabelaDemonstrativaComponent
              notaId={selectedNota.id}
              tabelas={tabelas}
              onTabelasChange={handleTabelasChange}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
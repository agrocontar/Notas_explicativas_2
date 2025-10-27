import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import dynamic from 'next/dynamic';
import { NotaExplicativa } from "../types";

// Carregar ReactQuill dinamicamente
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="flex align-items-center justify-content-center p-4">Carregando editor...</div>
});

interface NotaEditorProps {
  selectedNota: NotaExplicativa | null;
  visible: boolean;
  editTitle: string;
  editContent: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
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
  return (
    <Dialog
      header={`Editar Nota ${selectedNota?.number}`}
      visible={visible}
      style={{ 
        width: '95vw', 
        height: '90vh',
        maxWidth: '1000px'
      }}
      className="w-full max-w-4xl"
      onHide={onHide}
      footer={
        <div className="flex flex-wrap gap-2 justify-content-end">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-sm"
            onClick={onHide}
          />
          <Button
            label="Salvar"
            icon="pi pi-check"
            className="p-button-primary p-button-sm"
            onClick={onSave}
          />
        </div>
      }
    >
      <div className="flex flex-column gap-3 h-full">
        <div className="field">
          <label htmlFor="title" className="font-semibold block mb-1 text-sm">
            Título
          </label>
          <InputText
            id="title"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full p-inputtext-sm"
          />
        </div>

        <div className="field flex-grow-1 flex flex-column">
          <label htmlFor="content" className="font-semibold block mb-1 text-sm">
            Conteúdo
          </label>
          <div className="flex-grow-1" style={{ minHeight: '300px' }}>
            <ReactQuill
              value={editContent}
              onChange={onContentChange}
              modules={modules}
              formats={formats}
              theme="snow"
              style={{ 
                height: '300px',
                marginBottom: '50px'
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-2 border-round">
          <h4 className="font-semibold mb-1 text-sm">Preview:</h4>
          <div 
            className="p-2 border-1 border-round surface-border bg-white max-h-8rem overflow-auto text-sm"
            style={{ maxHeight: '150px' }}
            dangerouslySetInnerHTML={{ __html: editContent }}
          />
        </div>
      </div>
    </Dialog>
  );
}
'use client';

import api from "@/app/api/api";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { OrderList } from "primereact/orderlist";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Carregar ReactQuill dinamicamente (SSR compatibility)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="flex align-items-center justify-content-center p-4">Carregando editor...</div>
});


interface NotaExplicativa {
  id: string;
  number: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotasExplicativasPageProps {
  params: {
    id: string;
  };
}

export default function NotasExplicativasPage({ params }: NotasExplicativasPageProps) {
  const toast = useRef<Toast>(null);
  const [notas, setNotas] = useState<NotaExplicativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNota, setSelectedNota] = useState<NotaExplicativa | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Configuração do ReactQuill
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

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notas/${params.id}`);

      if (res.status >= 200 && res.status < 300) {
        setNotas(res.data);
      } else {
        console.error('Erro ao buscar as notas:', res.statusText);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar as notas explicativas.',
          life: 3000,
        });
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao conectar com o servidor.',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchNotas();
    }
  }, [params.id]);

  const handleNotaSelect = (nota: NotaExplicativa) => {
    setSelectedNota(nota);
  };

  const handleEdit = () => {
    if (selectedNota) {
      console.log('Nota selecionada para edição:', selectedNota);
      setEditTitle(selectedNota.title);
      setEditContent(selectedNota.content);
      setEditMode(true);
      setDialogVisible(true);
    }
  };

  const handleSave = async () => {
    if (!selectedNota) return;

    try {
      const res = await api.put(`/notas/${params.id}`, {
        number: selectedNota.number,
        title: editTitle,
        content: editContent
      });

      if (res.status >= 200 && res.status < 300) {
        const updatedNotas = notas.map(nota =>
          nota.id === selectedNota.id ? { 
            ...nota, 
            title: editTitle, 
            content: editContent,
            updatedAt: new Date().toISOString() 
          } : nota
        );
        setNotas(updatedNotas);
        setSelectedNota({ 
          ...selectedNota, 
          title: editTitle, 
          content: editContent,
          updatedAt: new Date().toISOString() 
        });

        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Nota atualizada com sucesso!',
          life: 3000,
        });

        setDialogVisible(false);
        setEditMode(false);
      }
    } catch (err) {
      console.error('Erro ao atualizar nota:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar a nota.',
        life: 3000,
      });
    }
  };

  const handleReorder = async (event: any) => {
    setNotas(event.value);
    
    toast.current?.show({
      severity: 'info',
      summary: 'Ordem Alterada',
      detail: 'A ordem das notas foi atualizada.',
      life: 2000,
    });
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setEditMode(false);
  };

  useEffect(() => {
    if (dialogVisible && selectedNota) {
      setEditTitle(selectedNota.title);
      setEditContent(selectedNota.content);
    }
  }, [dialogVisible, selectedNota]);

  const itemTemplate = (nota: NotaExplicativa) => {
    return (
      <div 
        className={`flex flex-column p-2 border-round cursor-pointer transition-colors transition-duration-200 ${
          selectedNota?.id === nota.id ? 'bg-blue-50 border-1 border-blue-200' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleNotaSelect(nota)}
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

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p className="mt-3">Carregando notas explicativas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="col-12">
        <Toast ref={toast} />

        {/* Cabeçalho mais compacto */}
        <div className="card mb-3">
          <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-2">
            <div className="flex flex-column">
              <h1 className="text-xl font-bold m-0">Notas Explicativas</h1>
              <span className="text-sm text-color-secondary">
                Gerencie as notas explicativas da empresa
              </span>
            </div>

            <Button
              icon="pi pi-refresh"
              label="Atualizar"
              className="p-button-outlined flex-shrink-0 p-button-sm"
              onClick={fetchNotas}
            />
          </div>
        </div>

        <div className="grid">
          {/* Lista de Notas - Mais espaço */}
          <div className="col-12 lg:col-6 xl:col-5">
            <div className="card h-full">
              <OrderList
                value={notas}
                itemTemplate={itemTemplate}
                header={headerTemplate()}
                dragdrop
                dataKey="id"
                onChange={handleReorder}
                listStyle={{ 
                  maxHeight: '65vh',
                  minHeight: '350px'
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Visualização da Nota Selecionada - Mais compacta */}
          <div className="col-12 lg:col-6 xl:col-7 mt-3 lg:mt-0">
            <div className="card h-full">
              {selectedNota ? (
                <div className="flex flex-column h-full">
                  <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2 mb-3 pb-2 border-bottom-1 surface-border">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold m-0 truncate">{selectedNota.title}</h2>
                      <span className="text-color-secondary text-xs">
                        Nota {selectedNota.number} • 
                        Atualizada: {new Date(selectedNota.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Button
                      icon="pi pi-pencil"
                      label="Editar"
                      className="p-button-outlined p-button-secondary flex-shrink-0 p-button-sm"
                      onClick={handleEdit}
                    />
                  </div>

                  <div 
                    className="flex-grow-1 overflow-auto prose max-w-none p-1"
                    style={{ 
                      maxHeight: '55vh',
                      minHeight: '250px'
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedNota.content }}
                  />
                </div>
              ) : (
                <div className="flex flex-column align-items-center justify-content-center text-center p-4" style={{ height: '350px' }}>
                  <i className="pi pi-file text-4xl text-color-secondary mb-2"></i>
                  <h3 className="text-lg font-semibold mb-1">Nenhuma nota selecionada</h3>
                  <p className="text-color-secondary text-sm mb-3">
                    Selecione uma nota na lista ao lado para visualizar seu conteúdo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog de Edição - Com React Quill */}
        <Dialog
          header={`Editar Nota ${selectedNota?.number}`}
          visible={dialogVisible}
          style={{ 
            width: '95vw', 
            height: '90vh', // Aumentei um pouco para acomodar o editor
            maxWidth: '1000px'
          }}
          className="w-full max-w-4xl"
          onHide={handleDialogHide}
          footer={
            <div className="flex flex-wrap gap-2 justify-content-end">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text p-button-sm"
                onClick={handleDialogHide}
              />
              <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-primary p-button-sm"
                onClick={handleSave}
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
                onChange={(e) => setEditTitle(e.target.value)}
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
                  onChange={setEditContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  style={{ 
                    height: '300px',
                    marginBottom: '50px' // Espaço para a toolbar não sobrepor
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
      </div>
    </div>
  );
}
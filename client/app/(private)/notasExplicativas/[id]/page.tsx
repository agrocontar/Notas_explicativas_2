'use client';

import api from "@/app/api/api";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { OrderList } from "primereact/orderlist";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";

interface NotaExplicativa {
  id: string;
  numero: number;
  titulo: string;
  conteudo: string;
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
  const [editTitulo, setEditTitulo] = useState("");
  const [editConteudo, setEditConteudo] = useState("");

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notas/empresa/${params.id}`);

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
      setEditTitulo(selectedNota.titulo);
      setEditConteudo(selectedNota.conteudo);
      setEditMode(true);
      setDialogVisible(true);
    }
  };

  const handleSave = async () => {
    if (!selectedNota) return;

    try {
      const res = await api.put(`/notas/${params.id}/${selectedNota.numero}`, {
        titulo: editTitulo,
        conteudo: editConteudo
      });

      if (res.status >= 200 && res.status < 300) {
        // Atualiza a lista local
        const updatedNotas = notas.map(nota =>
          nota.id === selectedNota.id ? { ...nota, titulo: editTitulo, conteudo: editConteudo } : nota
        );
        setNotas(updatedNotas);
        setSelectedNota({ ...selectedNota, titulo: editTitulo, conteudo: editConteudo });

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
    
    // Aqui você pode implementar a lógica para salvar a nova ordem no backend
    // Por enquanto, apenas atualizamos o estado local
    toast.current?.show({
      severity: 'info',
      summary: 'Ordem Alterada',
      detail: 'A ordem das notas foi atualizada.',
      life: 2000,
    });
  };

  const itemTemplate = (nota: NotaExplicativa) => {
    return (
      <div 
        className={`flex flex-column p-3 border-round cursor-pointer transition-colors transition-duration-200 ${
          selectedNota?.id === nota.id ? 'bg-blue-50 border-1 border-blue-200' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleNotaSelect(nota)}
      >
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-3">
            <span className="flex-shrink-0 w-2rem h-2rem bg-primary border-circle text-white font-bold flex align-items-center justify-content-center">
              {nota.numero}
            </span>
            <div className="flex flex-column">
              <span className="font-semibold text-lg">{nota.titulo}</span>
              <span className="text-sm text-color-secondary">
                Atualizada em: {new Date(nota.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <i className="pi pi-chevron-right text-color-secondary"></i>
        </div>
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center p-3">
        <span className="text-xl font-bold">Notas Explicativas</span>
        <span className="text-color-secondary">{notas.length} notas</span>
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

        {/* Cabeçalho */}
        <div className="card mb-4">
          <div className="flex justify-content-between align-items-center">
            <div>
              <h1 className="text-2xl font-bold m-0">Notas Explicativas</h1>
              <span className="text-lg text-color-secondary">
                Gerencie as notas explicativas da empresa
              </span>
            </div>

            <Button
              icon="pi pi-refresh"
              label="Atualizar"
              className="p-button-outlined"
              onClick={fetchNotas}
            />
          </div>
        </div>

        <div className="grid">
          {/* Lista de Notas */}
          <div className="col-12 lg:col-4">
            <div className="card">
              <OrderList
                value={notas}
                itemTemplate={itemTemplate}
                header={headerTemplate()}
                dragdrop
                dataKey="id"
                onChange={handleReorder}
                listStyle={{ maxHeight: '600px' }}
                className="w-full"
              />
            </div>
          </div>

          {/* Visualização da Nota Selecionada */}
          <div className="col-12 lg:col-8">
            <div className="card h-full">
              {selectedNota ? (
                <div className="flex flex-column h-full">
                  <div className="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 surface-border">
                    <div>
                      <h2 className="text-xl font-bold m-0">{selectedNota.titulo}</h2>
                      <span className="text-color-secondary">
                        Nota {selectedNota.numero} • 
                        Criada em: {new Date(selectedNota.createdAt).toLocaleDateString('pt-BR')} • 
                        Última atualização: {new Date(selectedNota.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Button
                      icon="pi pi-pencil"
                      label="Editar"
                      className="p-button-outlined p-button-secondary"
                      onClick={handleEdit}
                    />
                  </div>

                  <div 
                    className="flex-grow-1 overflow-auto prose max-w-none"
                    style={{ maxHeight: '500px' }}
                    dangerouslySetInnerHTML={{ __html: selectedNota.conteudo }}
                  />
                </div>
              ) : (
                <div className="flex flex-column align-items-center justify-content-center text-center p-6" style={{ height: '400px' }}>
                  <i className="pi pi-file text-6xl text-color-secondary mb-3"></i>
                  <h3 className="text-xl font-semibold mb-2">Nenhuma nota selecionada</h3>
                  <p className="text-color-secondary mb-4">
                    Selecione uma nota na lista ao lado para visualizar seu conteúdo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog de Edição */}
        <Dialog
          header={`Editar Nota ${selectedNota?.numero}`}
          visible={dialogVisible}
          style={{ width: '80vw', height: '80vh' }}
          onHide={() => {
            setDialogVisible(false);
            setEditMode(false);
          }}
          footer={
            <div>
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => {
                  setDialogVisible(false);
                  setEditMode(false);
                }}
              />
              <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-primary"
                onClick={handleSave}
              />
            </div>
          }
        >
          <div className="flex flex-column gap-4">
            <div className="field">
              <label htmlFor="titulo" className="font-semibold block mb-2">
                Título
              </label>
              <InputText
                id="titulo"
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="field flex-grow-1">
              <label htmlFor="conteudo" className="font-semibold block mb-2">
                Conteúdo (HTML)
              </label>
              <Editor
                value={editConteudo}
                onTextChange={(e) => setEditConteudo(e.htmlValue || '')}
                style={{ height: '400px' }}
              />
            </div>

            <div className="bg-gray-50 p-3 border-round">
              <h4 className="font-semibold mb-2">Preview:</h4>
              <div 
                className="p-3 border-1 border-round surface-border bg-white"
                dangerouslySetInnerHTML={{ __html: editConteudo }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
'use client';

import api from "@/app/api/api";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { NotaExplicativa, NotasExplicativasPageProps } from "./types";
import NotasHeader from "./components/NotasHeader";
import NotasList from "./components/NotasList";
import NotaViewer from "./components/NotaViewer";
import NotaEditor from "./components/NotaEditor";
import LoadingState from "./components/LoadingState";
import 'react-quill/dist/quill.snow.css';

export default function NotasExplicativasPage({ params }: NotasExplicativasPageProps) {
  const toast = useRef<Toast>(null);
  const [notas, setNotas] = useState<NotaExplicativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNota, setSelectedNota] = useState<NotaExplicativa | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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
      setEditTitle(selectedNota.title);
      setEditContent(selectedNota.content);
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

  const handleReorder = (event: any) => {
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
  };

  useEffect(() => {
    if (dialogVisible && selectedNota) {
      setEditTitle(selectedNota.title);
      setEditContent(selectedNota.content);
    }
  }, [dialogVisible, selectedNota]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="grid">
      <div className="col-12">
        <Toast ref={toast} />

        <NotasHeader onRefresh={fetchNotas} />

        <div className="grid">
          <NotasList
            notas={notas}
            selectedNota={selectedNota}
            onNotaSelect={handleNotaSelect}
            onReorder={handleReorder}
          />

          <NotaViewer
            selectedNota={selectedNota}
            onEdit={handleEdit}
          />
        </div>

        <NotaEditor
          selectedNota={selectedNota}
          visible={dialogVisible}
          editTitle={editTitle}
          editContent={editContent}
          onTitleChange={setEditTitle}
          onContentChange={setEditContent}
          onSave={handleSave}
          onHide={handleDialogHide}
        />
      </div>
    </div>
  );
}
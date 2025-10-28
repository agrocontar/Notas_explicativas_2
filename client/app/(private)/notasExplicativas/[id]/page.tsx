'use client';

import api from "@/app/api/api";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { NotaExplicativa, NotasExplicativasPageProps, TabelaDemonstrativa } from "./types";
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
        // Certifique-se de que as tabelas estão incluídas na resposta
        const notasComTabelas = res.data.map((nota: any) => ({
          ...nota,
          tabelas: nota.tabelas || []
        }));
        setNotas(notasComTabelas);
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

  const handleDelete = async (nota: NotaExplicativa) => {
    try {
      const res = await api.delete(`/notas/${params.id}/${nota.number}`);

      if (res.status >= 200 && res.status < 300) {
        // Remove a nota da lista
        const updatedNotas = notas.filter(n => n.id !== nota.id);
        setNotas(updatedNotas);
        
        // Se a nota deletada era a selecionada, limpa a seleção
        if (selectedNota?.id === nota.id) {
          setSelectedNota(null);
        }

        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Nota deletada com sucesso!',
          life: 3000,
        });
      }
    } catch (err) {
      console.error('Erro ao deletar nota:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao deletar a nota.',
        life: 3000,
      });
    }
  };

  // Atualize a função handleSave para receber as tabelas
  const handleSave = async (tabelasAtualizadas?: TabelaDemonstrativa[]) => {
    if (!selectedNota) return;

    try {
      const res = await api.put(`/notas/${params.id}`, {
        number: selectedNota.number,
        title: editTitle,
        content: editContent
      });

      if (res.status >= 200 && res.status < 300) {
        // Atualiza a nota na lista com as tabelas atualizadas
        const updatedNotas = notas.map(nota => {
          if (nota.id === selectedNota.id) {
            return { 
              ...nota, 
              title: editTitle, 
              content: editContent,
              tabelas: tabelasAtualizadas || nota.tabelas, // Usa as tabelas atualizadas ou mantém as existentes
              updatedAt: new Date().toISOString() 
            };
          }
          return nota;
        });
        
        setNotas(updatedNotas);
        
        // Atualiza a nota selecionada
        const notaAtualizada = updatedNotas.find(n => n.id === selectedNota.id);
        if (notaAtualizada) {
          setSelectedNota(notaAtualizada);
        }

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
            onDelete={handleDelete}
          />
        </div>

        <NotaEditor
          selectedNota={selectedNota}
          visible={dialogVisible}
          editTitle={editTitle}
          editContent={editContent}
          onTitleChange={setEditTitle}
          onContentChange={setEditContent}
          onSave={handleSave} // Agora passamos a função atualizada
          onHide={handleDialogHide}
        />
      </div>
    </div>
  );
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTabelaData {
  conta: string;
  anoAnterior: number | null;
  anoAtual: number | null;
  ordem: number;
}

export interface UpdateTabelaData {
  conta?: string;
  anoAnterior?: number | null;
  anoAtual?: number | null;
  ordem?: number;
}


export const getTabelasByNota = async (notaId: string) => {
    try {
      const tabelas = await prisma.tabelaDemonstrativa.findMany({
        where: { notaId },
        orderBy: { ordem: 'asc' }
      });

      return tabelas;
    } catch (error) {
      console.error('Erro ao buscar tabelas da nota:', error);
      throw error;
    }
  }

  /**
   * Criar uma nova linha na tabela
   */
export const createTabela = async (notaId: string, data: CreateTabelaData) => {
    try {
      // Verifica se a nota existe
      const nota = await prisma.notasExplicativas.findUnique({
        where: { id: notaId }
      });

      if (!nota) {
        throw new Error('Nota não encontrada');
      }

      const tabela = await prisma.tabelaDemonstrativa.create({
        data: {
          notaId,
          conta: data.conta,
          anoAnterior: data.anoAnterior,
          anoAtual: data.anoAtual,
          ordem: data.ordem
        }
      });

      return tabela;
    } catch (error) {
      console.error('Erro ao criar linha da tabela:', error);
      throw error;
    }
  }

  /**
   * Atualizar uma linha da tabela
   */
  export const updateTabela = async (id: string, data: UpdateTabelaData) => {
    try {
      const tabela = await prisma.tabelaDemonstrativa.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return tabela;
    } catch (error) {
      console.error('Erro ao atualizar linha da tabela:', error);
      throw error;
    }
  }

  /**
   * Deletar uma linha da tabela
   */
 export const deleteTabela = async (id: string) => {
    try {
      await prisma.tabelaDemonstrativa.delete({
        where: { id }
      });

      return { success: true, message: 'Linha da tabela deletada com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar linha da tabela:', error);
      throw error;
    }
  }

  /**
   * Reordenar as linhas da tabela
   */
  export const reorderTabelas = async (notaId: string, novasOrdens: { id: string; ordem: number }[]) => {
    try {
      // Usa transação para garantir que todas as atualizações sejam feitas
      const result = await prisma.$transaction(
        novasOrdens.map((item) =>
          prisma.tabelaDemonstrativa.update({
            where: { id: item.id },
            data: { ordem: item.ordem }
          })
        )
      );

      return result;
    } catch (error) {
      console.error('Erro ao reordenar tabela:', error);
      throw error;
    }
  }

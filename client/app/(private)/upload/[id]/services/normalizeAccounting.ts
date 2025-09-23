// normalizeAccountingAccount.ts
export const normalizeAccountingAccount = (account: string): string => {
  if (!account) return '';
  
  // Remover todos os caracteres não numéricos
  let cleaned = account.replace(/[^\d]/g, '');
  
  // Se estiver vazio após limpeza, retornar vazio
  if (cleaned === '') return '';
  
  // Se a conta tem menos de 10 dígitos, preencher com zeros à direita
  // até completar 10 dígitos (formato padrão do sistema)
  while (cleaned.length < 10) {
    cleaned += '0';
  }
  
  // Se tiver mais de 10 dígitos, truncar para 10
  if (cleaned.length > 10) {
    cleaned = cleaned.substring(0, 10);
  }
  
  return cleaned;
};
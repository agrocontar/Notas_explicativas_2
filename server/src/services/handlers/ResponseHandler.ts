// src/services/handlers/ResponseHandler.ts
import { Response } from 'express';

export class ResponseHandler {
  setDownloadHeaders(res: Response, companyId: string, contentLength: number): void {
    const filename = `notas-explicativas-${companyId}-${new Date().toISOString().split('T')[0]}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', contentLength.toString());
  }

  setAlternativeDownloadHeaders(res: Response, companyId: string, contentLength: number): void {
    const filename = `notas-explicativas-${companyId}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', contentLength.toString());
  }
}
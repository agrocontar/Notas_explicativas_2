// src/services/handlers/ResponseHandler.ts
import { Response } from 'express';

export class ResponseHandler {
  setDownloadHeaders(res: Response, name: string, contentLength: number): void {
    const filename = `notas-explicativas-${name}-${new Date().toISOString().split('T')[0]}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', contentLength.toString());
  }

  setAlternativeDownloadHeaders(res: Response, name: string, contentLength: number): void {
    const filename = `notas-explicativas-${name}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', contentLength.toString());
  }
}
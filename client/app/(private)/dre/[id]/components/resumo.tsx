import { Dre } from "../../types"

interface ResumoProps {
  dre: Dre[],
  formatCurrency: (value: number) => string,
  currentYear: boolean,
}

const Resumo = ( {dre, formatCurrency, currentYear}: ResumoProps) => {

  return (

    <div className="grid">
            <div className="col-12 md:col-4">
              <div className="p-3 border-round surface-card border-1 surface-border text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(dre
                    .filter(b => b.group === 'ATIVO_CIRCULANTE' || b.group === 'ATIVO_NAO_CIRCULANTE')
                    .reduce((sum, b) => sum + (currentYear ? b.totalCurrentYear : b.totalPreviousYear), 0)
                  )}
                </div>
                <div className="text-sm text-color-secondary">Total do Ativo</div>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="p-3 border-round surface-card border-1 surface-border text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(dre
                    .filter(b => b.group === 'PASSIVO_CIRCULANTE' || b.group === 'PASSIVO_NAO_CIRCULANTE')
                    .reduce((sum, b) => sum + (currentYear ? b.totalCurrentYear : b.totalPreviousYear), 0)
                  )}
                </div>
                <div className="text-sm text-color-secondary">Total do Passivo</div>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="p-3 border-round surface-card border-1 surface-border text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(dre
                    .filter(b => b.group === 'PATRIMONIO_LIQUIDO')
                    .reduce((sum, b) => sum + (currentYear ? b.totalCurrentYear : b.totalPreviousYear), 0)
                  )}
                </div>
                <div className="text-sm text-color-secondary">Total do PL</div>
              </div>
            </div>
          </div>
  )
}

export default Resumo
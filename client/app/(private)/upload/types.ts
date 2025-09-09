export interface AccountValidationResult {
  isValid: boolean;
  invalidAccounts: string[];
  validData: BalanceteRow[];
}

export interface CompanyAccount {
  accountingAccount: string;
  accountName: string;
}

export interface DefaultAccount {
  accountingAccount: string;
  accountName: string;
}

export interface MappedAccount {
  id: number;
  companyId: string;
  companyAccount: string;
  defaultAccountId: number;
  company: {
    id: string;
    name: string;
    cnpj: string;
    createdAt: string;
  };
  defaultAccount: {
    id: number;
    accountingAccount: string;
    accountName: string;
    createdAt: string;
  };
}


export interface BalanceteRow {
  accountingAccount: string;
  accountName: string;
  previousBalance: number;
  debit: number;
  credit: number;
  monthBalance: number;
  currentBalance: number;
}

export interface ExcelData {
  companyId: string;
  referenceDate: string;
  balanceteData: BalanceteRow[];
}
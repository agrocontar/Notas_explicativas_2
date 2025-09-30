export type Account = {
  id: number;
  accountingAccount: string;
  accountName: string;
  companyId?: string;
};

export type TemplateListProps = {
  companyId: string;
  initialData: Account[];
  onMappingCreated?: () => void;
};

export type DeleteMultipleAccountsPayload = {
  accountingAccounts: string[];
};
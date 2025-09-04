export type Account = {
  id: number;
  accountingAccount: string;
  accountName: string;
  companyId?: string;
};

export type TemplateListProps = {
  companyId: string;
  initialData: Account[];
};

export interface Balanco {
  id: number,
		name: string,
		group: string,
		accountingAccounts: string[],
		createdAt: string,
		updatedAt: string,
		totalCurrentYear: number,
    totalPreviousYear: number,
    accountingsFoundCurrentYear: number,
		accountingsFoundPreviousYear: number
}
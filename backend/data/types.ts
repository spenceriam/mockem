export interface SessionLimits {
  rowsGenerated: number;
  exportsUsed: number;
  schemasUsed: number;
}

export interface GenerateDataRequest {
  category: string;
  platform: string;
  schema: string;
  rowCount: number;
}

export interface GenerateDataResponse {
  data: any[];
  totalRows: number;
  preview: any[];
  sessionLimits: SessionLimits;
}

export interface ExportDataRequest {
  category: string;
  platform: string;
  schema: string;
  rowCount: number;
}

export interface SessionInfo {
  sessionId: string;
  limits: SessionLimits;
}

export const DAILY_LIMITS = {
  MAX_ROWS: 500,
  MAX_EXPORTS: 1,
  MAX_SCHEMAS: 1
} as const;

export const BUSINESS_CATEGORIES = [
  'sales-crm',
  'finance-erp', 
  'human-resources',
  'marketing-campaigns',
  'supply-chain'
] as const;

export const PLATFORMS = [
  'general',
  'salesforce',
  'oracle', 
  'sap',
  'shopify',
  'general-erp'
] as const;

export const SCHEMAS = {
  'sales-crm': ['companies', 'contacts', 'opportunities'],
  'finance-erp': ['accounts', 'transactions', 'vendors'],
  'human-resources': ['employees', 'departments'],
  'marketing-campaigns': ['campaigns', 'leads'],
  'supply-chain': ['products', 'orders', 'suppliers']
} as const;

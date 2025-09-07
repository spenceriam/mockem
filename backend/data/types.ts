export interface SessionLimits {
  rowsGenerated: number;
  exportsUsed: number;
  schemasUsed: number;
}

export interface GenerateDataRequest {
  category: string;
  platform: string;
  schemas: string[];
  rowCount: number;
}

export interface GenerateDataResponse {
  data: Record<string, any[]>;
  totalRows: number;
  preview: Record<string, any[]>;
  sessionLimits: SessionLimits;
}

export interface ExportDataRequest {
  category: string;
  platform: string;
  schemas: string[];
  rowCount: number;
}

export interface SessionInfo {
  sessionId: string;
  limits: SessionLimits;
}

export const DAILY_LIMITS = {
  MAX_ROWS: 500,
  MAX_EXPORTS: 5,
  MAX_SCHEMAS: 5
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

export const SCHEMA_RELATIONSHIPS = {
  'sales-crm': {
    companies: { primary: 'id', related: [] },
    contacts: { primary: 'id', related: [{ schema: 'companies', key: 'company_id' }] },
    opportunities: { primary: 'id', related: [{ schema: 'companies', key: 'company_id' }, { schema: 'contacts', key: 'contact_id' }] }
  },
  'finance-erp': {
    accounts: { primary: 'id', related: [] },
    transactions: { primary: 'id', related: [{ schema: 'accounts', key: 'account_id' }] },
    vendors: { primary: 'id', related: [] }
  },
  'human-resources': {
    departments: { primary: 'id', related: [] },
    employees: { primary: 'id', related: [{ schema: 'departments', key: 'department_id' }] }
  },
  'marketing-campaigns': {
    campaigns: { primary: 'id', related: [] },
    leads: { primary: 'id', related: [{ schema: 'campaigns', key: 'campaign_id' }] }
  },
  'supply-chain': {
    products: { primary: 'id', related: [] },
    suppliers: { primary: 'id', related: [] },
    orders: { primary: 'id', related: [{ schema: 'companies', key: 'customer_id' }] }
  }
} as const;

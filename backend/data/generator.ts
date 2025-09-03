import { api, APIError, Cookie } from "encore.dev/api";
import { mockemDB } from "./db";
import { GenerateDataRequest, GenerateDataResponse, SCHEMAS } from "./types";
import { validateSessionLimits, updateSessionLimits } from "./session";

interface GenerateDataRequestWithSession extends GenerateDataRequest {
  session?: Cookie<"session">;
}

// Generate mock data for a specific schema
export const generateData = api<GenerateDataRequestWithSession, GenerateDataResponse>(
  { expose: true, method: "POST", path: "/generate" },
  async (req) => {
    if (!req.session?.value) {
      throw APIError.unauthenticated("Session required");
    }

    const { category, platform, schema, rowCount } = req;
    const sessionId = req.session.value;

    // Validate request
    if (rowCount < 1 || rowCount > 100) {
      throw APIError.invalidArgument("Row count must be between 1 and 100");
    }

    if (!SCHEMAS[category as keyof typeof SCHEMAS]?.includes(schema)) {
      throw APIError.invalidArgument("Invalid schema for category");
    }

    // Check session limits
    const validation = await validateSessionLimits(sessionId, rowCount, false, true);
    if (!validation.valid) {
      throw APIError.resourceExhausted(validation.error!);
    }

    // Generate data based on schema
    const data = await generateSchemaData(schema, rowCount);
    const preview = data.slice(0, 10);

    // Update session limits
    const sessionLimits = await updateSessionLimits(sessionId, rowCount, 0, 1);

    return {
      data,
      totalRows: data.length,
      preview,
      sessionLimits
    };
  }
);

async function generateSchemaData(schema: string, rowCount: number): Promise<any[]> {
  switch (schema) {
    case 'companies':
      return await generateCompanies(rowCount);
    case 'contacts':
      return await generateContacts(rowCount);
    case 'opportunities':
      return await generateOpportunities(rowCount);
    case 'accounts':
      return await generateAccounts(rowCount);
    case 'transactions':
      return await generateTransactions(rowCount);
    case 'vendors':
      return await generateVendors(rowCount);
    case 'employees':
      return await generateEmployees(rowCount);
    case 'departments':
      return await generateDepartments(rowCount);
    case 'campaigns':
      return await generateCampaigns(rowCount);
    case 'leads':
      return await generateLeads(rowCount);
    case 'products':
      return await generateProducts(rowCount);
    case 'orders':
      return await generateOrders(rowCount);
    case 'suppliers':
      return await generateSuppliers(rowCount);
    default:
      throw APIError.invalidArgument("Unknown schema");
  }
}

async function generateCompanies(count: number): Promise<any[]> {
  const companies = await mockemDB.queryAll`
    SELECT * FROM companies ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = companies[i % companies.length];
    result.push({
      id: template.id + i * 1000,
      name: `${template.name} ${i > 0 ? `Branch ${i}` : ''}`,
      industry: template.industry,
      size: template.size,
      revenue: template.revenue + (Math.random() * 1000000),
      created_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    });
  }
  return result;
}

async function generateContacts(count: number): Promise<any[]> {
  const contacts = await mockemDB.queryAll`
    SELECT * FROM contacts ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = contacts[i % contacts.length];
    result.push({
      id: template.id + i * 1000,
      company_id: template.company_id,
      first_name: `${template.first_name}${i > 0 ? i : ''}`,
      last_name: template.last_name,
      email: `${template.first_name.toLowerCase()}${i > 0 ? i : ''}.${template.last_name.toLowerCase()}@company${Math.floor(Math.random() * 100)}.com`,
      title: template.title,
      department: template.department
    });
  }
  return result;
}

async function generateOpportunities(count: number): Promise<any[]> {
  const opportunities = await mockemDB.queryAll`
    SELECT * FROM opportunities ORDER BY RANDOM() LIMIT ${Math.min(count, 10)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = opportunities[i % opportunities.length];
    result.push({
      id: template.id + i * 1000,
      company_id: template.company_id,
      contact_id: template.contact_id,
      name: `${template.name} ${i > 0 ? `Phase ${i}` : ''}`,
      amount: template.amount + (Math.random() * 50000),
      stage: template.stage,
      probability: Math.floor(Math.random() * 100),
      close_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
    });
  }
  return result;
}

async function generateAccounts(count: number): Promise<any[]> {
  const accounts = await mockemDB.queryAll`
    SELECT * FROM accounts ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = accounts[i % accounts.length];
    result.push({
      id: template.id + i * 1000,
      account_number: `${template.account_number}${i.toString().padStart(3, '0')}`,
      name: `${template.name} ${i > 0 ? `Sub-${i}` : ''}`,
      type: template.type,
      balance: template.balance + (Math.random() * 1000000 - 500000)
    });
  }
  return result;
}

async function generateTransactions(count: number): Promise<any[]> {
  const transactions = await mockemDB.queryAll`
    SELECT * FROM transactions ORDER BY RANDOM() LIMIT ${Math.min(count, 10)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = transactions[i % transactions.length];
    result.push({
      id: template.id + i * 1000,
      account_id: template.account_id,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      description: `${template.description} #${i + 1}`,
      debit: template.debit ? template.debit + (Math.random() * 10000) : null,
      credit: template.credit ? template.credit + (Math.random() * 10000) : null
    });
  }
  return result;
}

async function generateVendors(count: number): Promise<any[]> {
  const vendors = await mockemDB.queryAll`
    SELECT * FROM vendors ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = vendors[i % vendors.length];
    result.push({
      id: template.id + i * 1000,
      name: `${template.name} ${i > 0 ? `Division ${i}` : ''}`,
      category: template.category,
      payment_terms: template.payment_terms
    });
  }
  return result;
}

async function generateEmployees(count: number): Promise<any[]> {
  const employees = await mockemDB.queryAll`
    SELECT * FROM employees ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = employees[i % employees.length];
    result.push({
      id: template.id + i * 1000,
      employee_number: `EMP${(parseInt(template.employee_number.slice(3)) + i * 100).toString().padStart(3, '0')}`,
      first_name: `${template.first_name}${i > 0 ? i : ''}`,
      last_name: template.last_name,
      email: `${template.first_name.toLowerCase()}${i > 0 ? i : ''}.${template.last_name.toLowerCase()}@company.com`,
      department_id: template.department_id,
      position: template.position,
      manager_id: template.manager_id,
      hire_date: new Date(Date.now() - Math.random() * 365 * 3 * 24 * 60 * 60 * 1000),
      salary: template.salary + (Math.random() * 20000 - 10000)
    });
  }
  return result;
}

async function generateDepartments(count: number): Promise<any[]> {
  const departments = await mockemDB.queryAll`
    SELECT * FROM departments ORDER BY RANDOM() LIMIT ${Math.min(count, 10)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = departments[i % departments.length];
    result.push({
      id: template.id + i * 1000,
      name: `${template.name} ${i > 0 ? `Division ${i}` : ''}`,
      head_id: template.head_id,
      budget: template.budget + (Math.random() * 500000)
    });
  }
  return result;
}

async function generateCampaigns(count: number): Promise<any[]> {
  const campaigns = await mockemDB.queryAll`
    SELECT * FROM campaigns ORDER BY RANDOM() LIMIT ${Math.min(count, 10)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = campaigns[i % campaigns.length];
    const startDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000);
    
    result.push({
      id: template.id + i * 1000,
      name: `${template.name} ${i > 0 ? `V${i}` : ''}`,
      type: template.type,
      budget: template.budget + (Math.random() * 100000),
      start_date: startDate,
      end_date: endDate,
      target_audience: template.target_audience
    });
  }
  return result;
}

async function generateLeads(count: number): Promise<any[]> {
  const leads = await mockemDB.queryAll`
    SELECT * FROM leads ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = leads[i % leads.length];
    result.push({
      id: template.id + i * 1000,
      campaign_id: template.campaign_id,
      email: `lead${i + 1}@prospect${Math.floor(Math.random() * 100)}.com`,
      source: template.source,
      score: Math.floor(Math.random() * 100),
      status: template.status
    });
  }
  return result;
}

async function generateProducts(count: number): Promise<any[]> {
  const products = await mockemDB.queryAll`
    SELECT * FROM products ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = products[i % products.length];
    result.push({
      id: template.id + i * 1000,
      sku: `${template.sku}${i.toString().padStart(3, '0')}`,
      name: `${template.name} ${i > 0 ? `Model ${i}` : ''}`,
      category: template.category,
      unit_cost: template.unit_cost + (Math.random() * 1000),
      stock_level: Math.floor(Math.random() * 500)
    });
  }
  return result;
}

async function generateOrders(count: number): Promise<any[]> {
  const orders = await mockemDB.queryAll`
    SELECT * FROM orders ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = orders[i % orders.length];
    result.push({
      id: template.id + i * 1000,
      customer_id: template.customer_id,
      order_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: template.status,
      total_amount: template.total_amount + (Math.random() * 50000)
    });
  }
  return result;
}

async function generateSuppliers(count: number): Promise<any[]> {
  const suppliers = await mockemDB.queryAll`
    SELECT * FROM suppliers ORDER BY RANDOM() LIMIT ${Math.min(count, 15)}
  `;
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const template = suppliers[i % suppliers.length];
    result.push({
      id: template.id + i * 1000,
      name: `${template.name} ${i > 0 ? `Branch ${i}` : ''}`,
      category: template.category,
      lead_time_days: template.lead_time_days + Math.floor(Math.random() * 10)
    });
  }
  return result;
}

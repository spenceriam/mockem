import { api, APIError, Cookie } from "encore.dev/api";
import { mockemDB } from "./db";
import { GenerateDataRequest, GenerateDataResponse, SCHEMAS, SCHEMA_RELATIONSHIPS } from "./types";
import { validateSessionLimits, updateSessionLimits } from "./session";

interface GenerateDataRequestWithSession extends GenerateDataRequest {
  session?: Cookie<"session">;
}

// Generate mock data for multiple schemas with relationships
export const generateData = api<GenerateDataRequestWithSession, GenerateDataResponse>(
  { expose: true, method: "POST", path: "/generate" },
  async (req) => {
    if (!req.session?.value) {
      throw APIError.unauthenticated("Session required");
    }

    const { category, platform, schemas, rowCount } = req;
    const sessionId = req.session.value;

    // Validate request
    if (rowCount < 1 || rowCount > 100) {
      throw APIError.invalidArgument("Row count must be between 1 and 100");
    }

    if (!schemas || schemas.length === 0) {
      throw APIError.invalidArgument("At least one schema must be specified");
    }

    const categorySchemas = SCHEMAS[category as keyof typeof SCHEMAS];
    if (!categorySchemas) {
      throw APIError.invalidArgument("Invalid category");
    }

    for (const schema of schemas) {
      if (!categorySchemas.includes(schema as any)) {
        throw APIError.invalidArgument(`Invalid schema '${schema}' for category '${category}'`);
      }
    }

    // No session limits - unlimited for now
    // const validation = await validateSessionLimits(sessionId, totalRows, false, true);
    // if (!validation.valid) {
    //   throw APIError.resourceExhausted(validation.error!);
    // }

    // Generate data with relationships
    const data = await generateRelatedSchemaData(category, schemas, rowCount);
    
    // Create preview (first 10 rows of each schema)
    const preview: Record<string, any[]> = {};
    for (const schema of schemas) {
      preview[schema] = data[schema].slice(0, 10);
    }

    // Update session limits
    const totalRows = schemas.length * rowCount;
    const sessionLimits = await updateSessionLimits(sessionId, totalRows, 0, 1);

    return {
      data,
      totalRows,
      preview,
      sessionLimits
    };
  }
);

export async function generateRelatedSchemaData(category: string, schemas: string[], rowCount: number): Promise<Record<string, any[]>> {
  const result: Record<string, any[]> = {};
  const relationships = SCHEMA_RELATIONSHIPS[category as keyof typeof SCHEMA_RELATIONSHIPS];
  
  if (!relationships) {
    throw APIError.invalidArgument("Unknown category");
  }

  // Sort schemas by dependency order (independent schemas first)
  const sortedSchemas = sortSchemasByDependency(schemas, relationships);
  
  // Generate data for each schema in dependency order
  for (const schema of sortedSchemas) {
    result[schema] = await generateSchemaData(schema, rowCount, result);
  }

  return result;
}

function sortSchemasByDependency(schemas: string[], relationships: any): string[] {
  const sorted: string[] = [];
  const remaining = [...schemas];

  while (remaining.length > 0) {
    const independent = remaining.filter(schema => {
      const deps = relationships[schema]?.related || [];
      return deps.every((dep: any) => !remaining.includes(dep.schema) || sorted.includes(dep.schema));
    });

    if (independent.length === 0) {
      // Add remaining schemas if no clear dependency order
      sorted.push(...remaining);
      break;
    }

    sorted.push(...independent);
    independent.forEach(schema => {
      const index = remaining.indexOf(schema);
      if (index > -1) remaining.splice(index, 1);
    });
  }

  return sorted;
}

export async function generateSchemaData(schema: string, rowCount: number, existingData: Record<string, any[]> = {}): Promise<any[]> {
  switch (schema) {
    case 'companies':
      return await generateCompanies(rowCount);
    case 'contacts':
      return await generateContacts(rowCount, existingData.companies);
    case 'opportunities':
      return await generateOpportunities(rowCount, existingData.companies, existingData.contacts);
    case 'accounts':
      return await generateAccounts(rowCount);
    case 'transactions':
      return await generateTransactions(rowCount, existingData.accounts);
    case 'vendors':
      return await generateVendors(rowCount);
    case 'employees':
      return await generateEmployees(rowCount, existingData.departments);
    case 'departments':
      return await generateDepartments(rowCount);
    case 'campaigns':
      return await generateCampaigns(rowCount);
    case 'leads':
      return await generateLeads(rowCount, existingData.campaigns);
    case 'products':
      return await generateProducts(rowCount);
    case 'orders':
      return await generateOrders(rowCount, existingData.companies);
    case 'suppliers':
      return await generateSuppliers(rowCount);
    default:
      throw APIError.invalidArgument("Unknown schema");
  }
}

// Realistic data generation functions
const FIRST_NAMES = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jennifer', 'William', 'Jessica',
  'James', 'Lisa', 'Christopher', 'Amanda', 'Daniel', 'Michelle', 'Matthew', 'Ashley', 'Anthony', 'Kimberly',
  'Mark', 'Donna', 'Donald', 'Carol', 'Steven', 'Ruth', 'Paul', 'Sharon', 'Andrew', 'Laura',
  'Joshua', 'Sandra', 'Kenneth', 'Cynthia', 'Kevin', 'Amy', 'Brian', 'Angela', 'George', 'Helen',
  'Edward', 'Brenda', 'Ronald', 'Emma', 'Timothy', 'Olivia', 'Jason', 'Katherine', 'Jeffrey', 'Rachel'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const COMPANY_NAMES = [
  'Acme Corporation', 'Global Dynamics', 'Pinnacle Systems', 'Venture Solutions', 'Innovative Technologies',
  'Strategic Partners', 'NextGen Industries', 'Quantum Enterprises', 'Precision Manufacturing', 'Elite Services',
  'Advanced Solutions', 'Dynamic Systems', 'Premier Technologies', 'Excellence Group', 'Unity Corporation',
  'Apex Industries', 'Meridian Solutions', 'Catalyst Corporation', 'Synergy Partners', 'Vertex Systems',
  'Horizon Technologies', 'Vanguard Solutions', 'Paramount Industries', 'Summit Corporation', 'Nexus Group',
  'Titan Enterprises', 'Phoenix Solutions', 'Atlas Corporation', 'Sterling Industries', 'Beacon Technologies',
  'Oracle Enterprises', 'DataTech Solutions', 'CloudForce Systems', 'TechnoVision Inc', 'Digital Frontier',
  'InnovatePro Ltd', 'MetaTech Corporation', 'FutureTech Industries', 'ProActive Solutions', 'SmartSys Corp'
];

const COMPANY_SUFFIXES = ['Inc', 'Corp', 'LLC', 'Ltd', 'Co', 'Group', 'Systems', 'Solutions', 'Technologies', 'Industries'];

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Real Estate',
  'Consulting', 'Marketing', 'Transportation', 'Energy', 'Telecommunications', 'Construction',
  'Agriculture', 'Entertainment', 'Legal Services', 'Automotive', 'Aerospace', 'Pharmaceuticals'
];

const DOMAINS = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'corp.com', 'business.com',
  'enterprise.com', 'solutions.com', 'systems.com', 'group.com', 'tech.com', 'services.com'
];

const PRODUCT_CATEGORIES = [
  'Electronics', 'Software', 'Hardware', 'Accessories', 'Components', 'Tools', 'Equipment',
  'Supplies', 'Materials', 'Services', 'Consulting', 'Training', 'Support', 'Maintenance'
];

const CAMPAIGN_TYPES = [
  'Email Marketing', 'Social Media', 'Content Marketing', 'Pay-Per-Click', 'Display Advertising',
  'Event Marketing', 'Direct Mail', 'Webinar', 'Trade Show', 'Referral Program', 'Influencer Marketing'
];

const LEAD_SOURCES = [
  'Website', 'LinkedIn', 'Google Ads', 'Facebook', 'Email Campaign', 'Referral', 'Trade Show',
  'Cold Call', 'Content Download', 'Webinar', 'Partner', 'Direct Mail', 'Social Media'
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(daysBack: number = 365): Date {
  const now = new Date();
  const randomTime = Math.random() * daysBack * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() - randomTime);
}

function randomFutureDate(daysForward: number = 365): Date {
  const now = new Date();
  const randomTime = Math.random() * daysForward * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + randomTime);
}

function generateEmail(firstName: string, lastName: string, company?: string): string {
  const domain = company ? 
    `${company.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}.com` : 
    randomChoice(DOMAINS);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

async function generateCompanies(count: number): Promise<any[]> {
  const result = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let companyName;
    do {
      const baseName = randomChoice(COMPANY_NAMES);
      const suffix = Math.random() > 0.7 ? ` ${randomChoice(COMPANY_SUFFIXES)}` : '';
      companyName = baseName + suffix;
    } while (usedNames.has(companyName));
    
    usedNames.add(companyName);
    
    result.push({
      id: i + 1,
      name: companyName,
      industry: randomChoice(INDUSTRIES),
      size: randomChoice(['Small', 'Medium', 'Large', 'Enterprise']),
      revenue: Math.floor(Math.random() * 50000000) + 1000000, // $1M to $50M
      created_date: randomDate(1000)
    });
  }
  return result;
}

async function generateContacts(count: number, companies?: any[]): Promise<any[]> {
  const titles = [
    'CEO', 'CTO', 'CFO', 'VP Sales', 'VP Marketing', 'VP Operations', 'Sales Director',
    'Marketing Director', 'Operations Manager', 'Account Manager', 'Sales Manager',
    'Product Manager', 'Business Development Manager', 'Senior Consultant', 'Project Manager'
  ];
  
  const departments = [
    'Executive', 'Sales', 'Marketing', 'Operations', 'Finance', 'Engineering',
    'Product', 'Business Development', 'Customer Success', 'Human Resources'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const company = companies ? companies[i % companies.length] : null;
    const companyId = company ? company.id : (i % 5) + 1;
    
    result.push({
      id: i + 1,
      company_id: companyId,
      first_name: firstName,
      last_name: lastName,
      email: generateEmail(firstName, lastName, company?.name),
      title: randomChoice(titles),
      department: randomChoice(departments)
    });
  }
  return result;
}

async function generateOpportunities(count: number, companies?: any[], contacts?: any[]): Promise<any[]> {
  const opportunityNames = [
    'Q1 Software Implementation', 'Enterprise Platform Upgrade', 'Digital Transformation Initiative',
    'Cloud Migration Project', 'System Integration', 'Custom Development Project', 'Consulting Engagement',
    'Annual License Renewal', 'Professional Services Contract', 'Training and Support Package',
    'Software License Deal', 'Hardware Procurement', 'IT Infrastructure Upgrade', 'Security Assessment',
    'Data Analytics Platform', 'Mobile App Development', 'Website Redesign Project', 'ERP Implementation'
  ];
  
  const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies ? companies[i % companies.length] : null;
    const contact = contacts ? contacts[i % contacts.length] : null;
    const companyId = company ? company.id : (i % 5) + 1;
    const contactId = contact ? contact.id : (i % 5) + 1;
    
    result.push({
      id: i + 1,
      company_id: companyId,
      contact_id: contactId,
      name: randomChoice(opportunityNames),
      amount: Math.floor(Math.random() * 500000) + 10000, // $10K to $500K
      stage: randomChoice(stages),
      probability: Math.floor(Math.random() * 100),
      close_date: randomFutureDate(180)
    });
  }
  return result;
}

async function generateAccounts(count: number): Promise<any[]> {
  const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  const accountNames = [
    'Cash - Operating', 'Accounts Receivable', 'Inventory', 'Equipment', 'Accounts Payable',
    'Accrued Expenses', 'Common Stock', 'Retained Earnings', 'Sales Revenue', 'Cost of Goods Sold',
    'Operating Expenses', 'Marketing Expenses', 'Research & Development', 'Interest Income'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const accountNumber = (1000 + i * 100).toString();
    
    result.push({
      id: i + 1,
      account_number: accountNumber,
      name: randomChoice(accountNames),
      type: randomChoice(accountTypes),
      balance: Math.floor(Math.random() * 10000000) - 5000000 // -$5M to $5M
    });
  }
  return result;
}

async function generateTransactions(count: number, accounts?: any[]): Promise<any[]> {
  const descriptions = [
    'Customer Payment', 'Supplier Invoice', 'Payroll Expense', 'Office Rent', 'Utility Payment',
    'Equipment Purchase', 'Marketing Campaign', 'Professional Services', 'Bank Interest',
    'Insurance Premium', 'Software License', 'Travel Expense', 'Training Cost'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const account = accounts ? accounts[i % accounts.length] : null;
    const accountId = account ? account.id : (i % 5) + 1;
    const amount = Math.floor(Math.random() * 100000) + 100; // $100 to $100K
    const isDebit = Math.random() > 0.5;
    
    result.push({
      id: i + 1,
      account_id: accountId,
      date: randomDate(90),
      description: randomChoice(descriptions),
      debit: isDebit ? amount : null,
      credit: !isDebit ? amount : null
    });
  }
  return result;
}

async function generateVendors(count: number): Promise<any[]> {
  const vendorNames = [
    'Office Depot', 'Staples Business', 'Amazon Business', 'Best Buy for Business',
    'Dell Technologies', 'Microsoft', 'Google Workspace', 'Salesforce', 'Oracle',
    'SAP', 'Adobe', 'Cisco Systems', 'IBM', 'HP Enterprise', 'Lenovo'
  ];
  
  const categories = [
    'Office Supplies', 'Technology', 'Software', 'Consulting', 'Marketing',
    'Legal Services', 'Accounting', 'Insurance', 'Telecommunications', 'Security'
  ];
  
  const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Net 60', '2/10 Net 30', 'Due on Receipt'];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      name: randomChoice(vendorNames),
      category: randomChoice(categories),
      payment_terms: randomChoice(paymentTerms)
    });
  }
  return result;
}

async function generateEmployees(count: number, departments?: any[]): Promise<any[]> {
  const positions = [
    'Software Engineer', 'Senior Software Engineer', 'Project Manager', 'Product Manager',
    'Sales Representative', 'Account Executive', 'Marketing Specialist', 'HR Specialist',
    'Financial Analyst', 'Operations Coordinator', 'Customer Success Manager', 'DevOps Engineer',
    'UX Designer', 'Business Analyst', 'Quality Assurance Engineer', 'Data Analyst'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const department = departments ? departments[i % departments.length] : null;
    const departmentId = department ? department.id : (i % 5) + 1;
    const employeeNumber = `EMP${(1000 + i).toString()}`;
    
    result.push({
      id: i + 1,
      employee_number: employeeNumber,
      first_name: firstName,
      last_name: lastName,
      email: generateEmail(firstName, lastName),
      department_id: departmentId,
      position: randomChoice(positions),
      manager_id: i > 0 ? Math.floor(Math.random() * i) + 1 : null,
      hire_date: randomDate(1000),
      salary: Math.floor(Math.random() * 150000) + 50000 // $50K to $200K
    });
  }
  return result;
}

async function generateDepartments(count: number): Promise<any[]> {
  const departmentNames = [
    'Engineering', 'Sales', 'Marketing', 'Human Resources', 'Finance',
    'Operations', 'Customer Success', 'Product Management', 'Legal', 'IT Support'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      name: randomChoice(departmentNames),
      head_id: null, // Will be updated after employees are generated
      budget: Math.floor(Math.random() * 2000000) + 500000 // $500K to $2.5M
    });
  }
  return result;
}

async function generateCampaigns(count: number): Promise<any[]> {
  const campaignNames = [
    'Spring Product Launch', 'Holiday Sale Campaign', 'Brand Awareness Initiative',
    'Lead Generation Program', 'Customer Retention Campaign', 'New Market Expansion',
    'Product Demo Series', 'Industry Conference Promotion', 'Partner Marketing Program'
  ];
  
  const targetAudiences = [
    'Enterprise Decision Makers', 'Small Business Owners', 'IT Professionals',
    'Marketing Managers', 'C-Level Executives', 'Technical Professionals',
    'Existing Customers', 'Prospective Clients', 'Industry Specialists'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const startDate = randomFutureDate(30);
    const endDate = new Date(startDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    result.push({
      id: i + 1,
      name: randomChoice(campaignNames),
      type: randomChoice(CAMPAIGN_TYPES),
      budget: Math.floor(Math.random() * 500000) + 10000, // $10K to $500K
      start_date: startDate,
      end_date: endDate,
      target_audience: randomChoice(targetAudiences)
    });
  }
  return result;
}

async function generateLeads(count: number, campaigns?: any[]): Promise<any[]> {
  const leadStatuses = ['New', 'Contacted', 'Qualified', 'Nurturing', 'Converted', 'Lost'];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const campaign = campaigns ? campaigns[i % campaigns.length] : null;
    const campaignId = campaign ? campaign.id : (i % 3) + 1;
    
    result.push({
      id: i + 1,
      campaign_id: campaignId,
      email: generateEmail(firstName, lastName),
      source: randomChoice(LEAD_SOURCES),
      score: Math.floor(Math.random() * 100),
      status: randomChoice(leadStatuses)
    });
  }
  return result;
}

async function generateProducts(count: number): Promise<any[]> {
  const productNames = [
    'Wireless Bluetooth Headphones', 'Ergonomic Office Chair', 'Stainless Steel Water Bottle',
    'Laptop Stand', 'Wireless Charging Pad', 'Noise Cancelling Earbuds', 'Standing Desk',
    'Mechanical Keyboard', 'External Monitor', 'Webcam HD', 'Tablet Stand', 'USB Hub',
    'Cable Management Kit', 'Desk Organizer', 'LED Desk Lamp'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const sku = `SKU${(1000 + i).toString()}`;
    
    result.push({
      id: i + 1,
      sku: sku,
      name: randomChoice(productNames),
      category: randomChoice(PRODUCT_CATEGORIES),
      unit_cost: Math.floor(Math.random() * 50000) + 500, // $5 to $500
      stock_level: Math.floor(Math.random() * 1000)
    });
  }
  return result;
}

async function generateOrders(count: number, companies?: any[]): Promise<any[]> {
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies ? companies[i % companies.length] : null;
    const customerId = company ? company.id : (i % 5) + 1;
    
    result.push({
      id: i + 1,
      customer_id: customerId,
      order_date: randomDate(60),
      status: randomChoice(orderStatuses),
      total_amount: Math.floor(Math.random() * 100000) + 1000 // $1K to $100K
    });
  }
  return result;
}

async function generateSuppliers(count: number): Promise<any[]> {
  const supplierNames = [
    'Global Components Inc', 'Precision Parts Ltd', 'Quality Materials Corp', 'Reliable Suppliers LLC',
    'International Trade Co', 'Advanced Manufacturing', 'Premier Wholesale', 'Elite Distribution',
    'Strategic Sourcing Partners', 'Worldwide Supply Chain', 'Professional Vendors Inc'
  ];
  
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push({
      id: i + 1,
      name: randomChoice(supplierNames),
      category: randomChoice(PRODUCT_CATEGORIES),
      lead_time_days: Math.floor(Math.random() * 30) + 1 // 1 to 30 days
    });
  }
  return result;
}

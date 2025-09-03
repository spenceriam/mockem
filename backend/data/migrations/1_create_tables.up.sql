-- Sales CRM Tables
CREATE TABLE companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  size TEXT NOT NULL,
  revenue BIGINT NOT NULL,
  created_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL
);

CREATE TABLE opportunities (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id),
  contact_id BIGINT NOT NULL REFERENCES contacts(id),
  name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  stage TEXT NOT NULL,
  probability INTEGER NOT NULL,
  close_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Finance ERP Tables
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  account_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance BIGINT NOT NULL
);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT NOT NULL REFERENCES accounts(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  debit BIGINT,
  credit BIGINT
);

CREATE TABLE vendors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  payment_terms TEXT NOT NULL
);

-- HR Tables
CREATE TABLE departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  budget BIGINT NOT NULL
);

CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  employee_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department_id BIGINT NOT NULL REFERENCES departments(id),
  position TEXT NOT NULL,
  manager_id BIGINT REFERENCES employees(id),
  hire_date TIMESTAMP WITH TIME ZONE NOT NULL,
  salary BIGINT NOT NULL
);

-- Update departments to have head_id reference employees
ALTER TABLE departments ADD COLUMN head_id BIGINT REFERENCES employees(id);

-- Marketing Tables
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  budget BIGINT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_audience TEXT NOT NULL
);

CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id),
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL
);

-- Supply Chain Tables
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit_cost BIGINT NOT NULL,
  stock_level INTEGER NOT NULL
);

CREATE TABLE suppliers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lead_time_days INTEGER NOT NULL
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES companies(id),
  order_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  total_amount BIGINT NOT NULL
);

-- Session tracking table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  rows_generated INTEGER NOT NULL DEFAULT 0,
  exports_used INTEGER NOT NULL DEFAULT 0,
  schemas_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

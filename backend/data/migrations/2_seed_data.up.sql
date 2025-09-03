-- Seed Companies
INSERT INTO companies (name, industry, size, revenue, created_date) VALUES
('TechFlow Solutions', 'Technology', 'Medium', 12500000, '2022-03-15 10:30:00+00'),
('Global Manufacturing Corp', 'Manufacturing', 'Large', 89000000, '2020-01-22 09:15:00+00'),
('HealthFirst Medical', 'Healthcare', 'Medium', 34500000, '2021-07-08 14:20:00+00'),
('RetailMax Inc', 'Retail', 'Large', 156000000, '2019-05-30 11:45:00+00'),
('EcoEnergy Partners', 'Energy', 'Small', 8900000, '2023-02-14 16:10:00+00'),
('FinanceForward Bank', 'Financial Services', 'Large', 234000000, '2018-11-05 08:30:00+00'),
('InnovateLabs', 'Research & Development', 'Small', 5600000, '2023-08-20 13:25:00+00'),
('LogisticsPro', 'Transportation', 'Medium', 45600000, '2020-09-12 10:00:00+00'),
('DataDriven Analytics', 'Technology', 'Small', 7800000, '2023-01-30 15:40:00+00'),
('ConsultCorp', 'Consulting', 'Medium', 23400000, '2021-04-18 12:15:00+00'),
('BuildRight Construction', 'Construction', 'Large', 78900000, '2019-12-03 09:30:00+00'),
('FoodFirst Distribution', 'Food & Beverage', 'Medium', 36700000, '2020-06-25 14:55:00+00'),
('MediaMax Entertainment', 'Media', 'Medium', 19800000, '2022-10-07 11:20:00+00'),
('AutoAdvance Motors', 'Automotive', 'Large', 189000000, '2017-08-14 10:45:00+00'),
('PharmaPure Labs', 'Pharmaceuticals', 'Medium', 67800000, '2019-03-28 13:00:00+00');

-- Seed Contacts
INSERT INTO contacts (company_id, first_name, last_name, email, title, department) VALUES
(1, 'Sarah', 'Johnson', 'sarah.johnson@techflow.com', 'Chief Technology Officer', 'Engineering'),
(1, 'Michael', 'Chen', 'michael.chen@techflow.com', 'Sales Director', 'Sales'),
(1, 'Emma', 'Williams', 'emma.williams@techflow.com', 'Product Manager', 'Product'),
(2, 'Robert', 'Brown', 'robert.brown@globalmanuf.com', 'VP Operations', 'Operations'),
(2, 'Lisa', 'Davis', 'lisa.davis@globalmanuf.com', 'CFO', 'Finance'),
(3, 'James', 'Wilson', 'james.wilson@healthfirst.com', 'Medical Director', 'Medical'),
(3, 'Anna', 'Martinez', 'anna.martinez@healthfirst.com', 'Head of Nursing', 'Medical'),
(4, 'David', 'Garcia', 'david.garcia@retailmax.com', 'Store Operations Manager', 'Operations'),
(4, 'Jennifer', 'Rodriguez', 'jennifer.rodriguez@retailmax.com', 'Marketing Director', 'Marketing'),
(5, 'Christopher', 'Lopez', 'christopher.lopez@ecoenergy.com', 'CEO', 'Executive'),
(6, 'Amanda', 'Hernandez', 'amanda.hernandez@financeforward.com', 'Branch Manager', 'Banking'),
(7, 'Daniel', 'Gonzalez', 'daniel.gonzalez@innovatelabs.com', 'Research Director', 'R&D'),
(8, 'Michelle', 'Anderson', 'michelle.anderson@logisticspro.com', 'Logistics Coordinator', 'Operations'),
(9, 'Kevin', 'Thomas', 'kevin.thomas@datadriven.com', 'Data Scientist', 'Analytics'),
(10, 'Rachel', 'Taylor', 'rachel.taylor@consultcorp.com', 'Senior Consultant', 'Consulting');

-- Seed Opportunities
INSERT INTO opportunities (company_id, contact_id, name, amount, stage, probability, close_date) VALUES
(1, 1, 'Enterprise Software Implementation', 150000, 'Proposal', 75, '2024-03-15 17:00:00+00'),
(1, 2, 'SaaS Platform Upgrade', 85000, 'Negotiation', 60, '2024-02-28 17:00:00+00'),
(2, 4, 'Manufacturing Process Optimization', 320000, 'Qualification', 40, '2024-04-30 17:00:00+00'),
(3, 6, 'Healthcare Management System', 275000, 'Proposal', 80, '2024-03-20 17:00:00+00'),
(4, 8, 'Retail Analytics Platform', 195000, 'Closed Won', 100, '2024-01-15 17:00:00+00'),
(5, 10, 'Energy Management Solution', 125000, 'Discovery', 25, '2024-05-15 17:00:00+00'),
(6, 11, 'Banking Software Suite', 450000, 'Negotiation', 70, '2024-03-31 17:00:00+00'),
(7, 12, 'Research Data Platform', 95000, 'Proposal', 65, '2024-04-10 17:00:00+00'),
(8, 13, 'Logistics Tracking System', 175000, 'Qualification', 50, '2024-05-01 17:00:00+00'),
(9, 14, 'Analytics Dashboard', 65000, 'Closed Won', 100, '2024-01-30 17:00:00+00');

-- Seed Accounts
INSERT INTO accounts (account_number, name, type, balance) VALUES
('1000', 'Cash - Operating', 'Asset', 150000000),
('1100', 'Accounts Receivable', 'Asset', 45000000),
('1200', 'Inventory', 'Asset', 78000000),
('1500', 'Equipment', 'Asset', 125000000),
('2000', 'Accounts Payable', 'Liability', -32000000),
('2100', 'Accrued Expenses', 'Liability', -18000000),
('3000', 'Common Stock', 'Equity', -200000000),
('3100', 'Retained Earnings', 'Equity', -148000000),
('4000', 'Revenue', 'Revenue', 0),
('5000', 'Cost of Goods Sold', 'Expense', 0),
('6000', 'Operating Expenses', 'Expense', 0),
('6100', 'Marketing Expenses', 'Expense', 0),
('6200', 'Research & Development', 'Expense', 0),
('7000', 'Interest Income', 'Revenue', 0),
('8000', 'Interest Expense', 'Expense', 0);

-- Seed Transactions
INSERT INTO transactions (account_id, date, description, debit, credit) VALUES
(1, '2024-01-15 09:00:00+00', 'Customer Payment - TechFlow Solutions', 15000000, NULL),
(2, '2024-01-15 09:00:00+00', 'Customer Payment - TechFlow Solutions', NULL, 15000000),
(9, '2024-01-15 09:00:00+00', 'Software License Revenue', NULL, 15000000),
(5, '2024-01-16 10:30:00+00', 'Office Supplies Purchase', 25000, NULL),
(1, '2024-01-16 10:30:00+00', 'Office Supplies Purchase', NULL, 25000),
(6, '2024-01-17 14:15:00+00', 'Marketing Campaign Expense', 75000, NULL),
(1, '2024-01-17 14:15:00+00', 'Marketing Campaign Expense', NULL, 75000),
(1, '2024-01-18 11:45:00+00', 'Equipment Purchase', NULL, 250000),
(4, '2024-01-18 11:45:00+00', 'Equipment Purchase', 250000, NULL),
(7, '2024-01-19 16:20:00+00', 'Interest on Savings', NULL, 12500);

-- Seed Vendors
INSERT INTO vendors (name, category, payment_terms) VALUES
('Office Depot Pro', 'Office Supplies', 'Net 30'),
('TechSource Hardware', 'Technology', 'Net 15'),
('Professional Services Inc', 'Consulting', 'Net 45'),
('Marketing Masters', 'Marketing', 'Net 30'),
('Facility Management Co', 'Facilities', 'Net 30'),
('Legal Eagles LLP', 'Legal Services', 'Net 15'),
('Insurance Partners', 'Insurance', 'Annual'),
('Travel Solutions', 'Travel', 'Net 7'),
('Telecom Solutions', 'Telecommunications', 'Net 30'),
('Security Systems Pro', 'Security', 'Net 30'),
('Cloud Services Inc', 'Technology', 'Monthly'),
('Maintenance Masters', 'Maintenance', 'Net 30'),
('Catering Excellence', 'Food Service', 'Net 15'),
('Training Professionals', 'Training', 'Net 30'),
('Audit & Compliance Co', 'Professional Services', 'Net 45');

-- Seed Departments
INSERT INTO departments (name, budget) VALUES
('Engineering', 2500000),
('Sales', 1800000),
('Marketing', 1200000),
('Human Resources', 800000),
('Finance', 600000),
('Operations', 1500000),
('Legal', 400000),
('Customer Support', 900000),
('Product Management', 1100000),
('Business Development', 700000);

-- Seed Employees (first batch without managers)
INSERT INTO employees (employee_number, first_name, last_name, email, department_id, position, hire_date, salary) VALUES
('EMP001', 'John', 'Smith', 'john.smith@company.com', 1, 'VP Engineering', '2020-01-15 09:00:00+00', 180000),
('EMP002', 'Jane', 'Doe', 'jane.doe@company.com', 2, 'VP Sales', '2020-02-01 09:00:00+00', 170000),
('EMP003', 'Bob', 'Wilson', 'bob.wilson@company.com', 3, 'VP Marketing', '2020-03-01 09:00:00+00', 160000),
('EMP004', 'Alice', 'Brown', 'alice.brown@company.com', 4, 'VP Human Resources', '2020-01-20 09:00:00+00', 150000),
('EMP005', 'Charlie', 'Davis', 'charlie.davis@company.com', 5, 'CFO', '2019-12-01 09:00:00+00', 200000);

-- Add more employees with managers
INSERT INTO employees (employee_number, first_name, last_name, email, department_id, position, manager_id, hire_date, salary) VALUES
('EMP006', 'Diana', 'Garcia', 'diana.garcia@company.com', 1, 'Senior Software Engineer', 1, '2021-06-15 09:00:00+00', 120000),
('EMP007', 'Edward', 'Martinez', 'edward.martinez@company.com', 1, 'Software Engineer', 1, '2022-03-01 09:00:00+00', 95000),
('EMP008', 'Fiona', 'Rodriguez', 'fiona.rodriguez@company.com', 2, 'Sales Manager', 2, '2021-08-01 09:00:00+00', 110000),
('EMP009', 'George', 'Lopez', 'george.lopez@company.com', 2, 'Account Executive', 2, '2022-01-15 09:00:00+00', 85000),
('EMP010', 'Helen', 'Hernandez', 'helen.hernandez@company.com', 3, 'Marketing Manager', 3, '2021-05-01 09:00:00+00', 105000),
('EMP011', 'Ivan', 'Gonzalez', 'ivan.gonzalez@company.com', 4, 'HR Specialist', 4, '2022-07-01 09:00:00+00', 75000),
('EMP012', 'Julia', 'Anderson', 'julia.anderson@company.com', 5, 'Financial Analyst', 5, '2022-09-01 09:00:00+00', 80000),
('EMP013', 'Kevin', 'Thomas', 'kevin.thomas@company.com', 1, 'DevOps Engineer', 1, '2023-01-15 09:00:00+00', 115000),
('EMP014', 'Linda', 'Taylor', 'linda.taylor@company.com', 2, 'Sales Development Rep', 2, '2023-04-01 09:00:00+00', 65000),
('EMP015', 'Mike', 'Moore', 'mike.moore@company.com', 3, 'Content Specialist', 3, '2023-02-15 09:00:00+00', 70000);

-- Update departments with head_id
UPDATE departments SET head_id = 1 WHERE id = 1;
UPDATE departments SET head_id = 2 WHERE id = 2;
UPDATE departments SET head_id = 3 WHERE id = 3;
UPDATE departments SET head_id = 4 WHERE id = 4;
UPDATE departments SET head_id = 5 WHERE id = 5;

-- Seed Campaigns
INSERT INTO campaigns (name, type, budget, start_date, end_date, target_audience) VALUES
('Q1 Product Launch', 'Product Launch', 250000, '2024-01-01 00:00:00+00', '2024-03-31 23:59:59+00', 'Enterprise Decision Makers'),
('Summer Sale Campaign', 'Promotional', 150000, '2024-06-01 00:00:00+00', '2024-08-31 23:59:59+00', 'Existing Customers'),
('Brand Awareness Initiative', 'Brand Awareness', 300000, '2024-01-15 00:00:00+00', '2024-12-31 23:59:59+00', 'Technology Professionals'),
('Webinar Series', 'Educational', 75000, '2024-02-01 00:00:00+00', '2024-05-31 23:59:59+00', 'SMB Decision Makers'),
('Trade Show Presence', 'Event Marketing', 180000, '2024-03-01 00:00:00+00', '2024-11-30 23:59:59+00', 'Industry Professionals'),
('Content Marketing Hub', 'Content Marketing', 120000, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', 'Technical Audience'),
('Holiday Promotion', 'Seasonal', 200000, '2024-11-01 00:00:00+00', '2024-12-31 23:59:59+00', 'All Customers'),
('Partner Referral Program', 'Partner Marketing', 90000, '2024-02-15 00:00:00+00', '2024-12-31 23:59:59+00', 'Channel Partners'),
('Email Nurture Series', 'Lead Nurturing', 60000, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', 'Qualified Leads'),
('Social Media Campaign', 'Digital Marketing', 100000, '2024-01-01 00:00:00+00', '2024-06-30 23:59:59+00', 'Young Professionals');

-- Seed Leads
INSERT INTO leads (campaign_id, email, source, score, status) VALUES
(1, 'lead1@prospect.com', 'LinkedIn Ad', 85, 'Qualified'),
(1, 'lead2@enterprise.com', 'Google Ads', 72, 'Nurturing'),
(2, 'customer1@existing.com', 'Email Campaign', 90, 'Converted'),
(2, 'customer2@loyal.com', 'Direct Mail', 68, 'Engaged'),
(3, 'professional1@tech.com', 'Content Download', 45, 'New'),
(3, 'professional2@software.com', 'Webinar', 78, 'Qualified'),
(4, 'smb1@business.com', 'Webinar Registration', 82, 'Qualified'),
(4, 'smb2@startup.com', 'Referral', 91, 'Converted'),
(5, 'industry1@manufacturing.com', 'Trade Show', 75, 'Engaged'),
(5, 'industry2@healthcare.com', 'Trade Show', 88, 'Qualified'),
(6, 'tech1@developer.com', 'Blog Post', 55, 'Nurturing'),
(7, 'holiday1@retail.com', 'Social Media', 70, 'Engaged'),
(8, 'partner1@reseller.com', 'Partner Portal', 95, 'Converted'),
(9, 'nurture1@prospects.com', 'Email Series', 60, 'Nurturing'),
(10, 'social1@millennial.com', 'Instagram', 40, 'New');

-- Seed Products
INSERT INTO products (sku, name, category, unit_cost, stock_level) VALUES
('SKU001', 'Wireless Bluetooth Headphones', 'Electronics', 4500, 150),
('SKU002', 'Ergonomic Office Chair', 'Furniture', 25000, 45),
('SKU003', 'Stainless Steel Water Bottle', 'Accessories', 1200, 300),
('SKU004', 'Laptop Stand Adjustable', 'Electronics', 3500, 80),
('SKU005', 'Desktop Organizer Set', 'Office Supplies', 800, 200),
('SKU006', 'USB-C Charging Cable', 'Electronics', 600, 500),
('SKU007', 'Noise Cancelling Earbuds', 'Electronics', 7500, 120),
('SKU008', 'Standing Desk Converter', 'Furniture', 18000, 25),
('SKU009', 'Wireless Mouse Pad', 'Electronics', 2200, 180),
('SKU010', 'Coffee Mug Warmer', 'Accessories', 1800, 90),
('SKU011', 'Monitor Arm Dual', 'Electronics', 8500, 35),
('SKU012', 'Desk Lamp LED', 'Furniture', 4200, 70),
('SKU013', 'Keyboard Mechanical', 'Electronics', 12000, 60),
('SKU014', 'Plant Pot Ceramic', 'Accessories', 1500, 250),
('SKU015', 'Cable Management Tray', 'Office Supplies', 950, 140);

-- Seed Suppliers
INSERT INTO suppliers (name, category, lead_time_days) VALUES
('ElectroSource Inc', 'Electronics', 14),
('FurniturePro Supply', 'Furniture', 21),
('OfficeMax Wholesale', 'Office Supplies', 7),
('TechComponents Ltd', 'Electronics', 10),
('EcoAccessories Co', 'Accessories', 12),
('PremiumElectronics', 'Electronics', 18),
('ModernFurniture Co', 'Furniture', 28),
('GreenOffice Supplies', 'Office Supplies', 5),
('InnovativeElectronics', 'Electronics', 15),
('QualityAccessories', 'Accessories', 9),
('RapidSupply Chain', 'Electronics', 8),
('ReliableFurniture', 'Furniture', 25),
('EfficientOffice', 'Office Supplies', 6),
('TopTechSuppliers', 'Electronics', 12),
('CreativeAccessories', 'Accessories', 11);

-- Seed Orders
INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES
(1, '2024-01-15 10:30:00+00', 'Delivered', 125000),
(2, '2024-01-18 14:15:00+00', 'Shipped', 89000),
(3, '2024-01-20 09:45:00+00', 'Processing', 156000),
(4, '2024-01-22 16:20:00+00', 'Delivered', 78000),
(5, '2024-01-25 11:10:00+00', 'Cancelled', 45000),
(6, '2024-01-28 13:30:00+00', 'Shipped', 234000),
(7, '2024-02-01 08:15:00+00', 'Processing', 67000),
(8, '2024-02-03 15:45:00+00', 'Delivered', 92000),
(9, '2024-02-05 12:20:00+00', 'Shipped', 178000),
(10, '2024-02-08 10:00:00+00', 'Processing', 134000),
(11, '2024-02-10 14:30:00+00', 'Delivered', 203000),
(12, '2024-02-12 09:15:00+00', 'Shipped', 87000),
(13, '2024-02-15 16:45:00+00', 'Processing', 145000),
(14, '2024-02-18 11:30:00+00', 'Delivered', 198000),
(15, '2024-02-20 13:00:00+00', 'Shipped', 112000);

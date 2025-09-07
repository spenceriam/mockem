# MockEm

Professional mock data generation for enterprise development teams. Generate realistic test data for business applications with production-ready schemas for Sales, Finance, HR, Marketing, and Supply Chain systems.

## Live Demo

**[Try MockEm Live](https://your-demo-url-here.encore.run)**

1. Visit the live demo
2. Choose a business category (Sales CRM, Finance ERP, HR, Marketing, or Supply Chain)
3. Select your platform (Salesforce, Oracle, SAP, Shopify, etc.)
4. Pick the data schemas you need
5. Generate up to 100 rows per schema
6. Export as CSV (single schema) or ZIP (multiple schemas)

Daily limits: 500 rows generated, 5 exports, 5 schemas (per session).

## Features

- **Enterprise-Grade Schemas**: Production-ready data models for major business platforms
- **Realistic & Compliant**: Fictitious data with referential integrity and real-world business patterns
- **Instant Generation**: Generate up to 500 rows of test data with one-click export
- **No Setup Required**: Session-based system with no accounts or API keys needed
- **Related Data**: Multiple schemas maintain foreign key relationships

## Business Categories

### Sales & CRM
- Companies, Contacts, Opportunities
- Platforms: Salesforce, General CRM

### Finance & ERP
- Accounts, Transactions, Vendors
- Platforms: Oracle, SAP, General ERP

### Human Resources
- Departments, Employees
- Platforms: General HR systems

### Marketing & Campaigns
- Campaigns, Leads
- Platforms: General marketing systems

### Supply Chain & Inventory
- Products, Orders, Suppliers
- Platforms: Shopify, General supply chain

## Tech Stack

### Backend (Encore.ts)
- **Framework**: Encore.ts for REST API development
- **Database**: PostgreSQL with built-in migrations
- **Architecture**: Service-oriented with type-safe API definitions
- **Infrastructure**: Built-in SQL database and session management

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
├── backend/
│   └── data/
│       ├── encore.service.ts      # Service definition
│       ├── db.ts                  # Database configuration
│       ├── generator.ts           # Data generation logic
│       ├── export.ts              # CSV/ZIP export functionality
│       ├── session.ts             # Session management
│       ├── waitlist.ts            # Waitlist functionality
│       ├── types.ts               # Type definitions
│       └── migrations/            # Database migrations
├── frontend/
│   ├── components/                # Reusable React components
│   ├── pages/                     # Page components
│   ├── lib/                       # Utility functions
│   └── App.tsx                    # Main application entry
```

## Local Development

### Prerequisites
- Node.js 18+ 
- Encore CLI

### Setup

1. **Install Encore CLI**
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. **Clone and run**
   ```bash
   git clone <repository-url>
   cd mockem
   encore run
   ```

3. **Access the application**
   - Backend API: `http://localhost:4000`
   - Frontend: `http://localhost:3000`

### Database
The PostgreSQL database is automatically provisioned by Encore with:
- Schema migrations in `backend/data/migrations/`
- Seed data for realistic examples
- Session tracking for usage limits

## API Endpoints

### Core Endpoints
- `GET /data/session` - Get or create user session
- `POST /data/generate` - Generate mock data
- `POST /data/export` - Export data as CSV/ZIP
- `POST /data/waitlist` - Join API access waitlist

### Data Generation
```typescript
// Generate related schemas with foreign key relationships
POST /data/generate
{
  "category": "sales-crm",
  "platform": "salesforce", 
  "schemas": ["companies", "contacts", "opportunities"],
  "rowCount": 50
}
```

### Export Options
- **Single Schema**: CSV file download
- **Multiple Schemas**: ZIP file with individual CSV files and manifest
- **Relationships**: Foreign key integrity maintained across schemas

## Data Schemas

All generated data is entirely fictional and includes:

- **Realistic Names**: Business and personal names from predefined lists
- **Valid Relationships**: Foreign keys properly linked between schemas
- **Business Logic**: Proper data types, ranges, and business rules
- **Platform Compatibility**: Schema structures match target platforms

## Session Management

- **No Authentication**: Uses secure session cookies
- **Daily Limits**: 500 rows, 5 exports, 5 schemas per 24-hour session
- **Automatic Cleanup**: Sessions expire after 24 hours
- **Usage Tracking**: Real-time limit display

## Deployment

This project is designed to be deployed on Encore's platform:

1. **Production Deploy**
   ```bash
   git push encore
   ```

2. **Environment Variables**
   - No external API keys required
   - All infrastructure managed by Encore

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `encore run`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Disclaimer

All generated data is purely fictional and created for testing purposes only. MockEm does not use or store any real personal or business information.

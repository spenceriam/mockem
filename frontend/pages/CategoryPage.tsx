import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Database,
  Building2,
  Cloud,
  Layers,
  ShoppingCart,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categoryInfo = {
  "sales-crm": {
    title: "Sales & CRM",
    description: "Customer relationship management, sales opportunities, and pipeline data",
    schemas: ["companies", "contacts", "opportunities"]
  },
  "finance-erp": {
    title: "Finance & ERP",
    description: "Financial records, accounting transactions, and vendor management",
    schemas: ["accounts", "transactions", "vendors"]
  },
  "human-resources": {
    title: "Human Resources", 
    description: "Employee data, organizational structures, and department management",
    schemas: ["employees", "departments"]
  },
  "marketing-campaigns": {
    title: "Marketing & Campaigns",
    description: "Campaign management, lead tracking, and marketing analytics",
    schemas: ["campaigns", "leads"]
  },
  "supply-chain": {
    title: "Supply Chain & Inventory",
    description: "Product catalogs, order management, and supplier relationships",
    schemas: ["products", "orders", "suppliers"]
  }
};

const platforms = [
  {
    id: "general",
    name: "General",
    description: "Platform-agnostic data structures suitable for any system",
    icon: Database,
    color: "text-slate-400"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Salesforce CRM schema with standard and custom objects",
    icon: Cloud,
    color: "text-blue-400"
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Oracle database schema optimized for enterprise applications",
    icon: Building2,
    color: "text-red-400"
  },
  {
    id: "sap",
    name: "SAP",
    description: "SAP ERP system compatible data structures and relationships",
    icon: Layers,
    color: "text-yellow-400"
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce platform schema for products, orders, and customers",
    icon: ShoppingCart,
    color: "text-green-400"
  },
  {
    id: "general-erp",
    name: "General ERP",
    description: "Generic ERP system schema for financial and operational data",
    icon: Settings,
    color: "text-purple-400"
  }
];

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  if (!category || !(category in categoryInfo)) {
    return <div>Category not found</div>;
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">MockEm</span>
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {info.title}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
              {info.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {info.schemas.map((schema) => (
                <Badge key={schema} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                  {schema}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Platform</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Select the platform variant that matches your target system for optimized data structures.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <platform.icon className={`h-8 w-8 ${platform.color}`} />
                      <CardTitle className="text-white">{platform.name}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-300">
                      {platform.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.schemas.map((schema) => (
                        <Button
                          key={schema}
                          variant="outline"
                          className="w-full justify-between border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500"
                          asChild
                        >
                          <Link to={`/category/${category}/${platform.id}/${schema}`}>
                            {schema}
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-slate-400">
            All generated data is purely fictional and created for testing purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

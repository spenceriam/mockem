import { useParams, Link } from "react-router-dom";
import {
  Database,
  Building2,
  Cloud,
  Layers,
  ShoppingCart,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AhoyHeader } from "@/components/AhoyHeader";
import { AhoyFooter } from "@/components/AhoyFooter";

const categoryInfo = {
  "sales-crm": {
    title: "Sales & CRM",
    description: "Customer relationship management, sales opportunities, and pipeline data",
    schemas: ["companies", "contacts", "opportunities"],
  },
  "finance-erp": {
    title: "Finance & ERP",
    description: "Financial records, accounting transactions, and vendor management",
    schemas: ["accounts", "transactions", "vendors"],
  },
  "human-resources": {
    title: "Human Resources",
    description: "Employee data, organizational structures, and department management",
    schemas: ["employees", "departments"],
  },
  "marketing-campaigns": {
    title: "Marketing & Campaigns",
    description: "Campaign management, lead tracking, and marketing analytics",
    schemas: ["campaigns", "leads"],
  },
  "supply-chain": {
    title: "Supply Chain & Inventory",
    description: "Product catalogs, order management, and supplier relationships",
    schemas: ["products", "orders", "suppliers"],
  },
};

const platforms = [
  {
    id: "general",
    name: "General",
    description: "Platform-agnostic data structures suitable for any system",
    icon: Database,
    color: "text-slate-400",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Salesforce CRM schema with standard and custom objects",
    icon: Cloud,
    color: "text-slate-400",
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Oracle database schema optimized for enterprise applications",
    icon: Building2,
    color: "text-slate-400",
  },
  {
    id: "sap",
    name: "SAP",
    description: "SAP ERP system compatible data structures and relationships",
    icon: Layers,
    color: "text-slate-400",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce platform schema for products, orders, and customers",
    icon: ShoppingCart,
    color: "text-slate-400",
  },
  {
    id: "general-erp",
    name: "General ERP",
    description: "Generic ERP system schema for financial and operational data",
    icon: Settings,
    color: "text-slate-400",
  },
];

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  if (!category || !(category in categoryInfo)) {
    return <div>Category not found</div>;
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];

  return (
    <div className="min-h-screen bg-background">
      <AhoyHeader backTo="/" backLabel="Back to Home" />

      {/* Category Header */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{info.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{info.description}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {info.schemas.map((schema) => (
                <Badge
                  key={schema}
                  variant="secondary"
                  className="bg-slate-700 text-slate-300 border-slate-600"
                >
                  {schema}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Choose Your Platform</h2>
            <p className="mt-2 text-muted-foreground">
              Select the platform variant that matches your target system for optimized data structures.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="space-y-4">
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <platform.icon className={`h-8 w-8 ${platform.color}`} />
                      <CardTitle className="text-foreground">{platform.name}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.schemas.map((schema) => (
                        <Button
                          key={schema}
                          variant="outline"
                          className="w-full justify-between border-slate-600 text-slate-300 hover:bg-slate-700"
                          asChild
                        >
                          <Link to={`/category/${category}/${platform.id}/${schema}`}>
                            {schema}
                            <ArrowRight className="h-4 w-4" />
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

      <AhoyFooter />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Database,
  Building2,
  Cloud,
  Layers,
  ShoppingCart,
  Settings,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AhoyHeader } from "@/components/AhoyHeader";
import { AhoyFooter } from "@/components/AhoyFooter";

const categoryInfo = {
  "sales-crm": {
    title: "Sales & CRM",
    description: "Customer relationship management, sales opportunities, and pipeline data",
    schemas: [
      { id: "companies", name: "Companies", description: "Company profiles and business information" },
      { id: "contacts", name: "Contacts", description: "Individual contacts within companies" },
      { id: "opportunities", name: "Opportunities", description: "Sales opportunities and pipeline data" }
    ],
  },
  "finance-erp": {
    title: "Finance & ERP",
    description: "Financial records, accounting transactions, and vendor management",
    schemas: [
      { id: "accounts", name: "Accounts", description: "Chart of accounts and financial structures" },
      { id: "transactions", name: "Transactions", description: "Financial transactions and journal entries" },
      { id: "vendors", name: "Vendors", description: "Vendor and supplier information" }
    ],
  },
  "human-resources": {
    title: "Human Resources",
    description: "Employee data, organizational structures, and department management",
    schemas: [
      { id: "departments", name: "Departments", description: "Organizational departments and structures" },
      { id: "employees", name: "Employees", description: "Employee records and information" }
    ],
  },
  "marketing-campaigns": {
    title: "Marketing & Campaigns",
    description: "Campaign management, lead tracking, and marketing analytics",
    schemas: [
      { id: "campaigns", name: "Campaigns", description: "Marketing campaigns and initiatives" },
      { id: "leads", name: "Leads", description: "Lead tracking and qualification data" }
    ],
  },
  "supply-chain": {
    title: "Supply Chain & Inventory",
    description: "Product catalogs, order management, and supplier relationships",
    schemas: [
      { id: "products", name: "Products", description: "Product catalog and inventory data" },
      { id: "suppliers", name: "Suppliers", description: "Supplier and vendor information" },
      { id: "orders", name: "Orders", description: "Order management and fulfillment data" }
    ],
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
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);
  const schemaSelectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!category || !(category in categoryInfo)) {
    return <div>Category not found</div>;
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];

  const handlePlatformSelect = (platformId: string) => {
    if (selectedPlatform !== platformId) {
      setSelectedPlatform(platformId);
      setSelectedSchemas([]); // Clear schemas on new platform selection
      // Scroll to schema selection
      setTimeout(() => {
        schemaSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSchemaToggle = (schemaId: string) => {
    if (!selectedPlatform) return;
    setSelectedSchemas(prev => 
      prev.includes(schemaId) 
        ? prev.filter(id => id !== schemaId)
        : [...prev, schemaId]
    );
  };

  const handleSelectAll = () => {
    if (!selectedPlatform) return;
    if (selectedSchemas.length === info.schemas.length) {
      setSelectedSchemas([]);
    } else {
      setSelectedSchemas(info.schemas.map(s => s.id));
    }
  };

  const handleContinue = () => {
    if (selectedPlatform && selectedSchemas.length > 0) {
      const schemasParam = selectedSchemas.join(',');
      navigate(`/category/${category}/${selectedPlatform}/${schemasParam}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AhoyHeader backTo="/" backLabel="Back to Home" />

      {/* Category Header */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{info.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">{info.description}</p>
            <p className="text-sm text-muted-foreground">
              Select your platform and the data schemas you need. Related data will maintain referential integrity.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Platform & Schema Selection */}
          <div className="lg:col-span-2">
            <div className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Choose Your Platform</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <Card 
                    key={platform.id} 
                    className={`cursor-pointer transition-all ${
                      selectedPlatform === platform.id
                        ? 'ring-2 ring-slate-400 bg-slate-800/50'
                        : 'bg-card border-border hover:bg-slate-800/30'
                    }`}
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <platform.icon className={`h-6 w-6 ${platform.color}`} />
                          <CardTitle className="text-lg text-foreground">{platform.name}</CardTitle>
                        </div>
                        {selectedPlatform === platform.id && (
                          <Check className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-muted-foreground text-sm">
                        {platform.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Schema Selection */}
            <div ref={schemaSelectionRef} className="relative scroll-mt-24">
              {!selectedPlatform && (
                <div 
                  className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg -m-4 p-4"
                >
                  <p className="text-lg font-semibold text-foreground text-center p-4 bg-card/80 rounded-md border border-border">
                    Please select a platform first
                  </p>
                </div>
              )}
              <div className={`transition-opacity ${!selectedPlatform ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">2. Select Data Schemas</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAll}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    disabled={!selectedPlatform}
                  >
                    {selectedSchemas.length === info.schemas.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="space-y-3">
                  {info.schemas.map((schema) => (
                    <Card 
                      key={schema.id}
                      className={`transition-all ${
                        !selectedPlatform ? 'cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        selectedSchemas.includes(schema.id)
                          ? 'ring-2 ring-slate-400 bg-slate-800/50'
                          : 'bg-card border-border hover:bg-slate-800/30'
                      }`}
                      onClick={() => handleSchemaToggle(schema.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            checked={selectedSchemas.includes(schema.id)}
                            disabled={!selectedPlatform}
                            onCheckedChange={() => handleSchemaToggle(schema.id)}
                            className="border-slate-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground">{schema.name}</h3>
                              <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                                {schema.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{schema.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground">Selection Summary</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Review your choices before proceeding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Platform</h4>
                  {selectedPlatform ? (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 border-slate-600">
                      {platforms.find(p => p.id === selectedPlatform)?.name}
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">No platform selected</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Schemas ({selectedSchemas.length})
                  </h4>
                  {selectedSchemas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSchemas.map(schemaId => (
                        <Badge key={schemaId} variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                          {schemaId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No schemas selected</p>
                  )}
                </div>

                {selectedSchemas.length > 1 && (
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-slate-400">
                      💡 Multiple schemas will be generated with proper relationships and exported as a ZIP file.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleContinue}
                  disabled={!selectedPlatform || selectedSchemas.length === 0}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100"
                >
                  Continue to Data Generation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AhoyFooter />
    </div>
  );
}

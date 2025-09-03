import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  DollarSign, 
  Building2, 
  Megaphone, 
  Package,
  ChevronRight,
  Database,
  Shield,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

const categories = [
  {
    id: "sales-crm",
    title: "Sales & CRM",
    description: "Customer relationships, opportunities, and sales pipeline data",
    icon: Users,
    color: "text-blue-400"
  },
  {
    id: "finance-erp",
    title: "Finance & ERP", 
    description: "Accounting records, transactions, and financial reporting data",
    icon: DollarSign,
    color: "text-green-400"
  },
  {
    id: "human-resources",
    title: "Human Resources",
    description: "Employee records, department structures, and organizational data",
    icon: Building2,
    color: "text-purple-400"
  },
  {
    id: "marketing-campaigns",
    title: "Marketing & Campaigns",
    description: "Campaign performance, leads, and marketing analytics data",
    icon: Megaphone,
    color: "text-orange-400"
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Inventory",
    description: "Products, orders, suppliers, and inventory management data",
    icon: Package,
    color: "text-teal-400"
  }
];

const features = [
  {
    icon: Database,
    title: "Enterprise-Grade Schemas",
    description: "Production-ready data models for major business platforms including Salesforce, Oracle, SAP, and more."
  },
  {
    icon: Shield,
    title: "Realistic & Compliant",
    description: "Fictitious data that maintains referential integrity and follows real-world business patterns."
  },
  {
    icon: Clock,
    title: "Instant Generation",
    description: "Generate up to 500 rows of test data instantly with one-click CSV export functionality."
  },
  {
    icon: Zap,
    title: "No Setup Required",
    description: "Start generating mock data immediately with our session-based system. No accounts or API keys needed."
  }
];

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [useCase, setUseCase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await backend.data.joinWaitlist({
        email,
        company: company || undefined,
        useCase: useCase || undefined
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: response.message,
        });
        setEmail("");
        setCompany("");
        setUseCase("");
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#categories" className="text-slate-300 hover:text-white transition-colors">Categories</a>
              <a href="#api" className="text-slate-300 hover:text-white transition-colors">API Access</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Enterprise Mock Data
            <span className="block text-blue-400">That Mirrors Reality</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Generate realistic test data for business applications with production-ready schemas 
            for Sales, Finance, HR, Marketing, and Supply Chain systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link to="#categories">Start Generating Data</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
              <a href="#api">Request API Access</a>
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            No signup required • 500 rows daily • All data is fictional
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for Enterprise Development</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Professional-grade mock data generation with realistic business patterns and relationships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Business Data Categories</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose from five comprehensive business domains, each with platform-specific schemas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer" asChild>
                <Link to={`/category/${category.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <category.icon className={`h-12 w-12 ${category.color} group-hover:scale-110 transition-transform`} />
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Waitlist Section */}
      <section id="api" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">API Access Coming Soon</h2>
            <p className="text-xl text-slate-300 mb-8">
              Programmatic access to MockEm's data generation capabilities. 
              Join the waitlist to be notified when our API becomes available.
            </p>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  <Textarea
                    placeholder="Use case (optional)"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    rows={3}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">MockEm</span>
          </div>
          <p className="text-slate-400 mb-4">
            Professional mock data generation for enterprise development teams.
          </p>
          <p className="text-sm text-slate-500">
            All generated data is purely fictional and created for testing purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

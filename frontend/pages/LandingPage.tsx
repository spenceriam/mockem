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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import { AhoyHeader } from "@/components/AhoyHeader";
import { AhoyFooter } from "@/components/AhoyFooter";
import { HackathonModal } from "@/components/HackathonModal";

const categories = [
  {
    id: "sales-crm",
    title: "Sales & CRM",
    description: "Customer relationships, opportunities, and sales pipeline data",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "finance-erp",
    title: "Finance & ERP",
    description: "Accounting records, transactions, and financial reporting data",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    id: "human-resources",
    title: "Human Resources",
    description: "Employee records, department structures, and organizational data",
    icon: Building2,
    color: "text-purple-600",
  },
  {
    id: "marketing-campaigns",
    title: "Marketing & Campaigns",
    description: "Campaign performance, leads, and marketing analytics data",
    icon: Megaphone,
    color: "text-orange-600",
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Inventory",
    description: "Products, orders, suppliers, and inventory management data",
    icon: Package,
    color: "text-teal-600",
  },
];

const features = [
  {
    icon: Database,
    title: "Enterprise-Grade Schemas",
    description:
      "Production-ready data models for major business platforms including Salesforce, Oracle, SAP, and more.",
  },
  {
    icon: Shield,
    title: "Realistic & Compliant",
    description: "Fictitious data that maintains referential integrity and follows real-world business patterns.",
  },
  {
    icon: Clock,
    title: "Instant Generation",
    description: "Generate up to 500 rows of test data instantly with one-click CSV export functionality.",
  },
  {
    icon: Zap,
    title: "No Setup Required",
    description:
      "Start generating mock data immediately with our session-based system. No accounts or API keys needed.",
  },
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
        useCase: useCase || undefined,
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
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AhoyHeader
        nav={[
          { label: "Features", href: "#features" },
          { label: "Categories", href: "#categories" },
          { label: "API Access", href: "#api" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Enterprise Mock Data
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                That Mirrors Reality
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
              Generate realistic test data for business applications with production-ready schemas for Sales, Finance,
              HR, Marketing, and Supply Chain systems.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#categories">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Start Generating Data
                </Button>
              </a>
              <HackathonModal>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:bg-slate-50 shadow-sm"
                >
                  Request API Access
                </Button>
              </HackathonModal>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              No signup required • 500 rows daily • All data is fictional
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Built for Enterprise Development
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Professional-grade mock data generation with realistic business patterns and relationships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Business Data Categories</h2>
            <p className="mt-3 text-lg text-slate-600">
              Choose from five comprehensive business domains, each with platform-specific schemas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/category/${category.id}`} className="block">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <category.icon
                        className={`h-12 w-12 ${category.color} transition-transform group-hover:scale-105`}
                      />
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <CardTitle className="text-slate-900 group-hover:text-blue-700 transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">{category.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Waitlist Section */}
      <section id="api" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">API Access Coming Soon</h2>
            <p className="mt-3 text-lg text-slate-600">
              Programmatic access to MockEm&apos;s data generation capabilities. Join the waitlist to be notified when
              our API becomes available.
            </p>
            <Card className="mt-8 bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-left">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  />
                  <Textarea
                    placeholder="Use case (optional)"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                    rows={3}
                  />
                  <HackathonModal>
                    <Button
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Join Waitlist
                    </Button>
                  </HackathonModal>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AhoyFooter />
    </div>
  );
}

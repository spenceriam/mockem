import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from "./pages/LandingPage";
import { CategoryPage } from "./pages/CategoryPage";
import { SchemaPage } from "./pages/SchemaPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/:platform/:schema" element={<SchemaPage />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

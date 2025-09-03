import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Database,
  Download,
  RefreshCw,
  BarChart3,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

interface SessionLimits {
  rowsGenerated: number;
  exportsUsed: number;
  schemasUsed: number;
}

export function SchemaPage() {
  const { category, platform, schema } = useParams<{ 
    category: string; 
    platform: string; 
    schema: string; 
  }>();
  
  const [rowCount, setRowCount] = useState(10);
  const [data, setData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sessionLimits, setSessionLimits] = useState<SessionLimits>({
    rowsGenerated: 0,
    exportsUsed: 0,
    schemasUsed: 0
  });
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const session = await backend.data.getSession();
      const sessionInfo = await backend.data.getSessionInfo();
      setSessionLimits(sessionInfo.limits);
    } catch (error) {
      console.error("Session initialization error:", error);
    }
  };

  const handleGenerate = async () => {
    if (!category || !platform || !schema) return;
    
    setIsGenerating(true);
    try {
      const response = await backend.data.generateData({
        category,
        platform,
        schema,
        rowCount
      });
      
      setData(response.preview);
      setHasGenerated(true);
      setSessionLimits(response.sessionLimits);
      
      toast({
        title: "Data Generated!",
        description: `Generated ${response.totalRows} rows of ${schema} data.`
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!category || !platform || !schema) return;
    
    setIsExporting(true);
    try {
      const response = await backend.data.exportData({
        category,
        platform,
        schema,
        rowCount
      });
      
      // Create download link
      const blob = new Blob([response.csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update session limits
      const sessionInfo = await backend.data.getSessionInfo();
      setSessionLimits(sessionInfo.limits);
      
      toast({
        title: "Export Complete!",
        description: `Downloaded ${response.filename}`
      });
    } catch (error: any) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCell = async (value: any) => {
    const stringValue = value?.toString() || '';
    try {
      await navigator.clipboard.writeText(stringValue);
      setCopiedCell(stringValue);
      setTimeout(() => setCopiedCell(null), 2000);
      toast({
        title: "Copied!",
        description: "Cell value copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      // Format currency values (assuming values > 1000 are currency in cents)
      if (value > 100000) {
        return `$${(value / 100).toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  };

  const remainingRows = 500 - sessionLimits.rowsGenerated;
  const remainingExports = 1 - sessionLimits.exportsUsed;
  const canGenerate = remainingRows >= rowCount;
  const canExport = remainingExports > 0 && hasGenerated;

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
              <Link to={`/category/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Category
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Schema Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
            <span>{category}</span>
            <span>/</span>
            <span>{platform}</span>
            <span>/</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              {schema}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 capitalize">
            {schema} Schema
          </h1>
          <p className="text-lg text-slate-300">
            Generate realistic {schema} data for {platform} platform testing and development.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Generate Data
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure and generate mock data for testing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="rowCount" className="text-white">Number of Rows</Label>
                  <Input
                    id="rowCount"
                    type="number"
                    min="1"
                    max="100"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 10)}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Maximum 100 rows per generation
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Generate Data
                      </>
                    )}
                  </Button>

                  {hasGenerated && (
                    <Button
                      onClick={handleExport}
                      disabled={!canExport || isExporting}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {isExporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Session Limits */}
                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-white font-semibold mb-3">Daily Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rows Generated:</span>
                      <span className="text-white">{sessionLimits.rowsGenerated}/500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exports Used:</span>
                      <span className="text-white">{sessionLimits.exportsUsed}/1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schemas Used:</span>
                      <span className="text-white">{sessionLimits.schemasUsed}/1</span>
                    </div>
                  </div>
                </div>

                {!canGenerate && (
                  <Alert className="border-orange-500/50 bg-orange-500/10">
                    <AlertDescription className="text-orange-200">
                      Daily row limit exceeded. You have {remainingRows} rows remaining.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Data Preview</CardTitle>
                <CardDescription className="text-slate-300">
                  {hasGenerated 
                    ? `Showing first 10 rows of ${data.length} generated records`
                    : "Generate data to see preview"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasGenerated && data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-600">
                          {Object.keys(data[0]).map((key) => (
                            <TableHead key={key} className="text-slate-300 font-semibold">
                              {key}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                            {Object.entries(row).map(([key, value]) => (
                              <TableCell 
                                key={key} 
                                className="text-slate-300 cursor-pointer hover:bg-slate-600/50 relative"
                                onClick={() => handleCopyCell(value)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate max-w-[200px]">
                                    {formatValue(value)}
                                  </span>
                                  {copiedCell === value?.toString() ? (
                                    <Check className="h-3 w-3 text-green-400 ml-2" />
                                  ) : (
                                    <Copy className="h-3 w-3 text-slate-500 ml-2 opacity-0 group-hover:opacity-100" />
                                  )}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No data generated yet</p>
                    <p className="text-slate-500 text-sm">
                      Click "Generate Data" to create mock {schema} records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8 border-slate-600 bg-slate-800/30">
          <AlertDescription className="text-slate-400">
            <strong>Disclaimer:</strong> All generated data is purely fictional and created for testing purposes only. 
            MockEm does not use or store any real personal or business information.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Database,
  Download,
  RefreshCw,
  BarChart3,
  Copy,
  Check,
  Package,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import { AhoyHeader } from "@/components/AhoyHeader";
import { AhoyFooter } from "@/components/AhoyFooter";

interface SessionLimits {
  rowsGenerated: number;
  exportsUsed: number;
  schemasUsed: number;
}

export function SchemaPage() {
  const { category, platform, schema: schemasParam } = useParams<{
    category: string;
    platform: string;
    schema: string;
  }>();

  const schemas = schemasParam?.split(',') || [];
  const [rowCount, setRowCount] = useState(10);
  const [data, setData] = useState<Record<string, any[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sessionLimits, setSessionLimits] = useState<SessionLimits | null>(null);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(schemas[0] || '');
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the current limits when the page loads.
    // The session cookie is already guaranteed to be set by App.tsx.
    const fetchCurrentLimits = async () => {
      try {
        const response = await backend.data.getSession({});
        setSessionLimits(response.sessionInfo.limits);
      } catch (error) {
        console.error("Failed to fetch session limits:", error);
        toast({
          title: "Error",
          description: "Could not fetch your current usage limits.",
          variant: "destructive",
        });
      }
    };

    fetchCurrentLimits();
    if (schemas.length > 0) {
      setActiveTab(schemas[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!category || !platform || schemas.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await backend.data.generateData({
        category,
        platform,
        schemas,
        rowCount,
      });

      setData(response.preview);
      setHasGenerated(true);
      setSessionLimits(response.sessionLimits);

      toast({
        title: "Data Generated!",
        description: `Generated ${response.totalRows} total rows across ${schemas.length} schema${schemas.length > 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!category || !platform || schemas.length === 0) return;

    setIsExporting(true);
    try {
      const response = await backend.data.exportData({
        category,
        platform,
        schemas,
        rowCount,
      });

      if (response.isZip && response.zipData) {
        // Handle ZIP download
        const zipContent = atob(response.zipData);
        const blob = new Blob([zipContent], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (response.csvData) {
        // Handle CSV download
        const blob = new Blob([response.csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      setSessionLimits(response.sessionLimits);

      toast({
        title: "Export Complete!",
        description: `Downloaded ${response.filename}`,
      });
    } catch (error: any) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCell = async (value: any) => {
    const stringValue = value?.toString() || "";
    try {
      await navigator.clipboard.writeText(stringValue);
      setCopiedCell(stringValue);
      setTimeout(() => setCopiedCell(null), 2000);
      toast({
        title: "Copied!",
        description: "Cell value copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") {
      if (value > 100000) {
        return `$${(value / 100).toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    if (value instanceof Date || (typeof value === "string" && value.includes("T"))) {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return value.toString();
        }
        return date.toLocaleDateString();
      } catch {
        return value.toString();
      }
    }
    return value.toString();
  };

  // For unlimited mode, always allow generation and export
  const canGenerate = true;
  const canExport = hasGenerated;
  const totalRows = schemas.length * rowCount;
  const isMultipleSchemas = schemas.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <AhoyHeader
        backTo={`/category/${category}`}
        backLabel="Back to Category"
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Schema Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span>{category}</span>
            <span>/</span>
            <span>{platform}</span>
            <span>/</span>
            <div className="flex flex-wrap gap-1">
              {schemas.map((schema, index) => (
                <span key={schema} className="flex items-center">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300 border-slate-600">
                    {schema}
                  </Badge>
                  {index < schemas.length - 1 && <span className="mx-1">+</span>}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground capitalize">
            {isMultipleSchemas 
              ? `${schemas.length} Related Schemas` 
              : `${schemas[0]} Schema`
            }
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isMultipleSchemas 
              ? `Generate related data across ${schemas.join(', ')} with maintained foreign key relationships for ${platform} platform.`
              : `Generate realistic ${schemas[0]} data for ${platform} platform testing and development.`
            }
          </p>
        </div>

        {/* Unlimited Access Notice */}
        <Alert className="mb-8 border-blue-600 bg-blue-950/20">
          <AlertDescription className="text-blue-400">
            🚀 Unlimited access enabled for testing! Generate as much data as you need.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-slate-400" />
                  Generate Data
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure and generate mock data{isMultipleSchemas ? ' with relationships' : ''}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="rowCount" className="text-foreground">
                    Rows per Schema
                  </Label>
                  <Input
                    id="rowCount"
                    type="number"
                    min="1"
                    max="100"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 10)}
                    className="mt-2 bg-background border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {isMultipleSchemas 
                      ? `Total: ${totalRows} rows (${rowCount} × ${schemas.length} schemas)`
                      : 'Maximum 100 rows per generation'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100"
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
                          {isMultipleSchemas ? <Package className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                          Export {isMultipleSchemas ? 'ZIP' : 'CSV'}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {isMultipleSchemas && (
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-slate-400">
                      💡 Multiple schemas will maintain foreign key relationships and be exported as a ZIP file with individual CSV files.
                    </p>
                  </div>
                )}

                {/* Session Stats (for tracking purposes) */}
                {sessionLimits && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-foreground font-semibold mb-3">Session Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rows Generated:</span>
                        <span className="text-foreground">{sessionLimits.rowsGenerated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exports Used:</span>
                        <span className="text-foreground">{sessionLimits.exportsUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Schemas Used:</span>
                        <span className="text-foreground">{sessionLimits.schemasUsed}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      No limits currently applied - unlimited generation enabled.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Data Preview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {hasGenerated
                    ? `Showing first 10 rows of each generated schema with maintained relationships`
                    : "Generate data to see preview with relationships"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasGenerated && Object.keys(data).length > 0 ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full bg-slate-800/50 border-slate-600" style={{gridTemplateColumns: `repeat(${schemas.length}, 1fr)`}}>
                      {schemas.map((schema) => (
                        <TabsTrigger 
                          key={schema} 
                          value={schema}
                          className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100"
                        >
                          {schema} ({data[schema]?.length || 0})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {schemas.map((schema) => (
                      <TabsContent key={schema} value={schema} className="mt-4">
                        {data[schema] && data[schema].length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-border">
                                  {Object.keys(data[schema][0]).map((key) => (
                                    <TableHead key={key} className="text-muted-foreground font-semibold">
                                      {key}
                                      {key.endsWith('_id') && (
                                        <Badge variant="outline" className="ml-1 text-xs bg-slate-700 text-slate-400 border-slate-600">
                                          FK
                                        </Badge>
                                      )}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {data[schema].map((row, index) => (
                                  <TableRow key={index} className="border-border hover:bg-muted/50">
                                    {Object.entries(row).map(([key, value]) => (
                                      <TableCell
                                        key={key}
                                        className="text-foreground cursor-pointer hover:bg-muted/80 relative"
                                        onClick={() => handleCopyCell(value)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="truncate max-w-[220px]">
                                            {formatValue(value)}
                                          </span>
                                          {copiedCell === value?.toString() ? (
                                            <Check className="h-3.5 w-3.5 text-green-400 ml-2" />
                                          ) : (
                                            <Copy className="h-3.5 w-3.5 text-muted-foreground ml-2 opacity-0 hover:opacity-100" />
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
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No data available for {schema}</p>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Database className="h-14 w-14 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-lg">No data generated yet</p>
                    <p className="text-muted-foreground text-sm">
                      Click &quot;Generate Data&quot; to create mock {isMultipleSchemas ? 'related' : schemas[0]} records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8 border-border bg-card shadow-sm">
          <AlertDescription className="text-muted-foreground">
            <strong className="font-semibold text-foreground">Disclaimer:</strong> All generated data is purely fictional
            and created for testing purposes only. {isMultipleSchemas && 'Foreign key relationships are maintained across schemas to ensure data integrity. '}
            MockEm does not use or store any real personal or business information.
          </AlertDescription>
        </Alert>
      </div>

      <AhoyFooter />
    </div>
  );
}

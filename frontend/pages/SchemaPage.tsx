import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Database,
  Download,
  RefreshCw,
  BarChart3,
  Copy,
  Check,
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
import { AhoyHeader } from "@/components/AhoyHeader";
import { AhoyFooter } from "@/components/AhoyFooter";

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
    schemasUsed: 0,
  });
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeSession = async () => {
    try {
      await backend.data.getSession();
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
        rowCount,
      });

      setData(response.preview);
      setHasGenerated(true);
      setSessionLimits(response.sessionLimits);

      toast({
        title: "Data Generated!",
        description: `Generated ${response.totalRows} rows of ${schema} data.`,
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
    if (!category || !platform || !schema) return;

    setIsExporting(true);
    try {
      const response = await backend.data.exportData({
        category,
        platform,
        schema,
        rowCount,
      });

      const blob = new Blob([response.csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const sessionInfo = await backend.data.getSessionInfo();
      setSessionLimits(sessionInfo.limits);

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
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  };

  const remainingRows = 500 - sessionLimits.rowsGenerated;
  const remainingExports = 1 - sessionLimits.exportsUsed;
  const canGenerate = remainingRows >= rowCount;
  const canExport = remainingExports > 0 && hasGenerated;

  return (
    <div className="min-h-screen bg-slate-50">
      <AhoyHeader
        backTo={`/category/${category}`}
        backLabel="Back to Category"
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Schema Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <span>{category}</span>
            <span>/</span>
            <span>{platform}</span>
            <span>/</span>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {schema}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 capitalize">{schema} Schema</h1>
          <p className="mt-2 text-slate-600">
            Generate realistic {schema} data for {platform} platform testing and development.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Generate Data
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configure and generate mock data for testing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="rowCount" className="text-slate-900">
                    Number of Rows
                  </Label>
                  <Input
                    id="rowCount"
                    type="number"
                    min="1"
                    max="100"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 10)}
                    className="mt-2 bg-white border-slate-300 text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1">Maximum 100 rows per generation</p>
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
                      className="w-full border-slate-300 text-slate-800 hover:bg-slate-50"
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
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-slate-900 font-semibold mb-3">Daily Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rows Generated:</span>
                      <span className="text-slate-900">{sessionLimits.rowsGenerated}/500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exports Used:</span>
                      <span className="text-slate-900">{sessionLimits.exportsUsed}/1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Schemas Used:</span>
                      <span className="text-slate-900">{sessionLimits.schemasUsed}/1</span>
                    </div>
                  </div>
                </div>

                {!canGenerate && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800">
                      Daily row limit exceeded. You have {remainingRows} rows remaining.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Data Preview</CardTitle>
                <CardDescription className="text-slate-600">
                  {hasGenerated
                    ? `Showing first 10 rows of ${data.length} generated records`
                    : "Generate data to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasGenerated && data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          {Object.keys(data[0]).map((key) => (
                            <TableHead key={key} className="text-slate-700 font-semibold">
                              {key}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index} className="border-slate-200 hover:bg-slate-50">
                            {Object.entries(row).map(([key, value]) => (
                              <TableCell
                                key={key}
                                className="text-slate-800 cursor-pointer hover:bg-slate-100 relative"
                                onClick={() => handleCopyCell(value)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate max-w-[220px]">
                                    {formatValue(value)}
                                  </span>
                                  {copiedCell === value?.toString() ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600 ml-2" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-slate-400 ml-2 opacity-0 hover:opacity-100" />
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
                    <Database className="h-14 w-14 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 text-lg">No data generated yet</p>
                    <p className="text-slate-500 text-sm">
                      Click &quot;Generate Data&quot; to create mock {schema} records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8 border-slate-200 bg-white shadow-sm">
          <AlertDescription className="text-slate-600">
            <strong className="font-semibold text-slate-900">Disclaimer:</strong> All generated data is purely fictional
            and created for testing purposes only. MockEm does not use or store any real personal or business
            information.
          </AlertDescription>
        </Alert>
      </div>

      <AhoyFooter />
    </div>
  );
}

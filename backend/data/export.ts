import { api, APIError, Cookie } from "encore.dev/api";
import { ExportDataRequest } from "./types";
import { validateSessionLimits, updateSessionLimits } from "./session";
import { generateSchemaData } from "./generator";

interface ExportDataRequestWithSession extends ExportDataRequest {
  session?: Cookie<"session">;
}

interface ExportDataResponse {
  csvData: string;
  filename: string;
}

// Export data as CSV
export const exportData = api<ExportDataRequestWithSession, ExportDataResponse>(
  { expose: true, method: "POST", path: "/export" },
  async (req) => {
    if (!req.session?.value) {
      throw APIError.unauthenticated("Session required");
    }

    const { category, platform, schema, rowCount } = req;
    const sessionId = req.session.value;

    // Validate request
    if (rowCount < 1 || rowCount > 100) {
      throw APIError.invalidArgument("Row count must be between 1 and 100");
    }

    // Check session limits
    const validation = await validateSessionLimits(sessionId, 0, true, false);
    if (!validation.valid) {
      throw APIError.resourceExhausted(validation.error!);
    }

    // Generate data (we'll use the same generator but won't count rows again)
    const data = await generateSchemaData(schema, rowCount);

    // Convert to CSV
    const csvData = convertToCSV(data, schema);
    const filename = `mockem_${category}_${platform}_${schema}_${new Date().toISOString().split('T')[0]}.csv`;

    // Update session limits
    await updateSessionLimits(sessionId, 0, 1, 0);

    return {
      csvData,
      filename
    };
  }
);

function convertToCSV(data: any[], schema: string): string {
  if (data.length === 0) return '';

  // Add MockEm header
  const header = `# Powered by MockEm - Enterprise Mock Data Generator\n# All data is purely fictional and generated for testing purposes\n# Generated on: ${new Date().toISOString()}\n\n`;

  // Get column names from first row
  const columns = Object.keys(data[0]);
  
  // Create CSV header
  const csvHeader = columns.join(',');
  
  // Create CSV rows
  const csvRows = data.map(row => {
    return columns.map(col => {
      const value = row[col];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = value.replace(/"/g, '""');
        return value.includes(',') || value.includes('"') || value.includes('\n') ? `"${escaped}"` : escaped;
      }
      
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      return String(value);
    }).join(',');
  });
  
  return header + [csvHeader, ...csvRows].join('\n');
}

// Import the generateSchemaData function
async function generateSchemaData(schema: string, rowCount: number): Promise<any[]> {
  // This is a simplified version - in a real implementation,
  // you'd import this from the generator module
  const { generateData } = await import('./generator');
  
  // We need to call the internal generation logic
  // For now, we'll return a placeholder
  return [];
}

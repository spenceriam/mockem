import { api, APIError, Cookie } from "encore.dev/api";
import { ExportDataRequest, SessionLimits } from "./types";
import { validateSessionLimits, updateSessionLimits } from "./session";
import { generateRelatedSchemaData } from "./generator";

interface ExportDataRequestWithSession extends ExportDataRequest {
  session?: Cookie<"session">;
}

interface ExportDataResponse {
  csvData?: string;
  zipData?: string;
  filename: string;
  isZip: boolean;
  sessionLimits: SessionLimits;
}

// Export data as CSV or ZIP
export const exportData = api<ExportDataRequestWithSession, ExportDataResponse>(
  { expose: true, method: "POST", path: "/export" },
  async (req) => {
    if (!req.session?.value) {
      throw APIError.unauthenticated("Session required");
    }

    const { category, platform, schemas, rowCount } = req;
    const sessionId = req.session.value;

    // Validate request
    if (rowCount < 1 || rowCount > 100) {
      throw APIError.invalidArgument("Row count must be between 1 and 100");
    }

    // No session limits for now - unlimited generation
    // const validation = await validateSessionLimits(sessionId, 0, true, false);
    // if (!validation.valid) {
    //   throw APIError.resourceExhausted(validation.error!);
    // }

    // Generate data with relationships
    const data = await generateRelatedSchemaData(category, schemas, rowCount);

    // Update session limits
    const newLimits = await updateSessionLimits(sessionId, 0, 1, 0);

    const timestamp = new Date().toISOString().split('T')[0];

    if (schemas.length === 1) {
      // Single schema - return CSV
      const csvData = convertToCSV(data[schemas[0]], schemas[0]);
      const filename = `mockem_${category}_${platform}_${schemas[0]}_${timestamp}.csv`;

      return {
        csvData,
        filename,
        isZip: false,
        sessionLimits: newLimits,
      };
    } else {
      // Multiple schemas - return ZIP
      const zipData = await createZipFile(data, category, platform, timestamp);
      const filename = `mockem_${category}_${platform}_${timestamp}.zip`;

      return {
        zipData,
        filename,
        isZip: true,
        sessionLimits: newLimits,
      };
    }
  }
);

function convertToCSV(data: any[], schema: string): string {
  if (data.length === 0) return '';

  // Add MockEm header
  const header = `# Powered by MockEm - Enterprise Mock Data Generator\n# All data is purely fictional and generated for testing purposes\n# Schema: ${schema}\n# Generated on: ${new Date().toISOString()}\n\n`;

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

async function createZipFile(data: Record<string, any[]>, category: string, platform: string, timestamp: string): Promise<string> {
  // Create a simple ZIP-like structure (base64 encoded)
  // In a real implementation, you'd use a proper ZIP library
  const files: Record<string, string> = {};
  
  for (const [schema, schemaData] of Object.entries(data)) {
    const csvContent = convertToCSV(schemaData, schema);
    files[`${schema}.csv`] = csvContent;
  }

  // Create a manifest file
  const manifest = {
    category,
    platform,
    generated_on: new Date().toISOString(),
    schemas: Object.keys(data),
    total_files: Object.keys(files).length,
    note: "All data is purely fictional and generated for testing purposes"
  };
  
  files['manifest.json'] = JSON.stringify(manifest, null, 2);

  // Simple concatenation for demo purposes
  // In production, use a proper ZIP library like JSZip
  const zipContent = Object.entries(files)
    .map(([filename, content]) => `--- FILE: ${filename} ---\n${content}\n--- END FILE ---\n`)
    .join('\n');

  return Buffer.from(zipContent).toString('base64');
}

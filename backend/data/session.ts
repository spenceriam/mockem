import { api, Cookie } from "encore.dev/api";
import { mockemDB } from "./db";
import { SessionInfo, SessionLimits, DAILY_LIMITS } from "./types";
import { randomBytes } from "crypto";

interface GetOrCreateSessionRequest {
  session?: Cookie<"session">;
}

interface SessionResponse {
  sessionInfo: SessionInfo;
  sessionCookie?: Cookie<"session">;
}

// Get or create a session
export const getSession = api<GetOrCreateSessionRequest, SessionResponse>(
  { expose: true, method: "GET", path: "/session" },
  async (req) => {
    if (req.session?.value) {
      const existingSession = await mockemDB.queryRow`
        SELECT * FROM sessions 
        WHERE id = ${req.session.value}
        AND created_at > NOW() - INTERVAL '1 day'
      `;

      if (existingSession) {
        return {
          sessionInfo: {
            sessionId: existingSession.id,
            limits: {
              rowsGenerated: existingSession.rows_generated,
              exportsUsed: existingSession.exports_used,
              schemasUsed: existingSession.schemas_used,
            },
          },
        };
      }
    }

    // Create a new session
    const sessionId = randomBytes(32).toString("hex");
    
    await mockemDB.exec`
      INSERT INTO sessions (id, rows_generated, exports_used, schemas_used)
      VALUES (${sessionId}, 0, 0, 0)
    `;

    const sessionInfo: SessionInfo = {
      sessionId,
      limits: {
        rowsGenerated: 0,
        exportsUsed: 0,
        schemasUsed: 0,
      },
    };

    return {
      sessionInfo,
      sessionCookie: {
        value: sessionId,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
      },
    };
  }
);

export async function updateSessionLimits(
  sessionId: string,
  rowsToAdd: number = 0,
  exportsToAdd: number = 0,
  schemasToAdd: number = 0
): Promise<SessionLimits> {
  await mockemDB.exec`
    UPDATE sessions 
    SET 
      rows_generated = rows_generated + ${rowsToAdd},
      exports_used = exports_used + ${exportsToAdd},
      schemas_used = schemas_used + ${schemasToAdd},
      last_used = NOW()
    WHERE id = ${sessionId}
  `;

  const session = await mockemDB.queryRow`
    SELECT * FROM sessions WHERE id = ${sessionId}
  `;

  return {
    rowsGenerated: session?.rows_generated || 0,
    exportsUsed: session?.exports_used || 0,
    schemasUsed: session?.schemas_used || 0
  };
}

export async function validateSessionLimits(
  sessionId: string,
  requestedRows: number,
  needsExport: boolean = false,
  needsNewSchema: boolean = false
): Promise<{ valid: boolean; error?: string }> {
  const session = await mockemDB.queryRow`
    SELECT * FROM sessions 
    WHERE id = ${sessionId}
    AND created_at > NOW() - INTERVAL '1 day'
  `;

  if (!session) {
    return { valid: false, error: "Invalid or expired session" };
  }

  const currentRows = session.rows_generated;
  const currentExports = session.exports_used;
  const currentSchemas = session.schemas_used;

  if (currentRows + requestedRows > DAILY_LIMITS.MAX_ROWS) {
    return { 
      valid: false, 
      error: `Daily row limit exceeded. You can generate ${DAILY_LIMITS.MAX_ROWS - currentRows} more rows today.` 
    };
  }

  if (needsExport && currentExports >= DAILY_LIMITS.MAX_EXPORTS) {
    return { 
      valid: false, 
      error: `Daily export limit exceeded. You can export ${DAILY_LIMITS.MAX_EXPORTS} schemas per day.` 
    };
  }

  if (needsNewSchema && currentSchemas >= DAILY_LIMITS.MAX_SCHEMAS) {
    return { 
      valid: false, 
      error: `Daily schema limit exceeded. You can use ${DAILY_LIMITS.MAX_SCHEMAS} schemas per day.` 
    };
  }

  return { valid: true };
}

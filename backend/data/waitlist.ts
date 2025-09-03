import { api } from "encore.dev/api";
import { mockemDB } from "./db";

interface JoinWaitlistRequest {
  email: string;
  company?: string;
  useCase?: string;
}

interface JoinWaitlistResponse {
  success: boolean;
  message: string;
}

// Join the API access waitlist
export const joinWaitlist = api<JoinWaitlistRequest, JoinWaitlistResponse>(
  { expose: true, method: "POST", path: "/waitlist" },
  async (req) => {
    const { email, company, useCase } = req;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address"
      };
    }

    try {
      // Create waitlist table if it doesn't exist
      await mockemDB.exec`
        CREATE TABLE IF NOT EXISTS waitlist (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          company TEXT,
          use_case TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `;

      // Insert into waitlist
      await mockemDB.exec`
        INSERT INTO waitlist (email, company, use_case)
        VALUES (${email}, ${company || null}, ${useCase || null})
        ON CONFLICT (email) DO NOTHING
      `;

      return {
        success: true,
        message: "Thank you for your interest! We'll notify you when API access becomes available."
      };
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong. Please try again later."
      };
    }
  }
);

/**
 * Supabase client for client-side operations
 * Uses anon key with RLS policies
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client (only usable when env vars are set)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// TypeScript database types (matching backend)
export type Database = {
  public: {
    Tables: {
      policy_rubrics: {
        Row: {
          id: string;
          name: string;
          rubric: any;
          document_metadata: any;
          created_at: string;
          updated_at: string;
          user_id: string | null;
        };
      };
      evaluations: {
        Row: {
          id: string;
          company_name: string;
          company_info: any;
          policy_rubric_id: string;
          status: string;
          created_at: string;
          completed_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          company_name: string;
          company_info: any;
          policy_rubric_id: string;
          status?: string;
          created_at?: string;
          completed_at?: string | null;
          user_id?: string | null;
        };
      };
      evaluation_results: {
        Row: {
          id: string;
          evaluation_id: string;
          rubric_results: any;
          tool_evidence: any;
          case_report: any;
          scores: any;
          created_at: string;
        };
      };
    };
  };
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          company_id: string | null
          created_at: string
          event_category: string
          event_data: Json | null
          event_name: string
          id: string
          page_url: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          event_category: string
          event_data?: Json | null
          event_name: string
          id?: string
          page_url?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          event_category?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          page_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          business_address: string | null
          created_at: string
          default_currency: string | null
          fill_enabled: boolean | null
          id: string
          name: string
          owner_id: string
          phone: string | null
          route_enabled: boolean | null
          shield_enabled: boolean | null
          subscription_status: string | null
          subscription_tier: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          business_address?: string | null
          created_at?: string
          default_currency?: string | null
          fill_enabled?: boolean | null
          id?: string
          name: string
          owner_id: string
          phone?: string | null
          route_enabled?: boolean | null
          shield_enabled?: boolean | null
          subscription_status?: string | null
          subscription_tier?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          business_address?: string | null
          created_at?: string
          default_currency?: string | null
          fill_enabled?: boolean | null
          id?: string
          name?: string
          owner_id?: string
          phone?: string | null
          route_enabled?: boolean | null
          shield_enabled?: boolean | null
          subscription_status?: string | null
          subscription_tier?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          notes: string | null
          phone: string | null
          property_address: string | null
          property_city: string | null
          property_sqft: number | null
          property_state: string | null
          property_type: string | null
          property_zip: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_city?: string | null
          property_sqft?: number | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_city?: string | null
          property_sqft?: number | null
          property_state?: string | null
          property_type?: string | null
          property_zip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customers_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          company_id: string
          created_at: string
          customer_id: string
          description: string | null
          id: string
          job_id: string
          opened_by: string
          priority: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          job_id: string
          opened_by: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          job_id?: string
          opened_by?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_disputes_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "v_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_opener"
            columns: ["opened_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_disputes_resolver"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      evidence_uploads: {
        Row: {
          caption: string | null
          company_id: string
          created_at: string
          file_type: string
          file_url: string
          id: string
          job_id: string
          latitude: number | null
          longitude: number | null
          taken_at: string | null
          thumbnail_url: string | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          company_id: string
          created_at?: string
          file_type?: string
          file_url: string
          id?: string
          job_id: string
          latitude?: number | null
          longitude?: number | null
          taken_at?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          company_id?: string
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          job_id?: string
          latitude?: number | null
          longitude?: number | null
          taken_at?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_evidence_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evidence_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evidence_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "v_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_evidence_uploader"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gps_verifications: {
        Row: {
          accuracy_meters: number | null
          company_id: string
          created_at: string
          device_info: Json | null
          distance_to_job_meters: number | null
          id: string
          is_valid: boolean | null
          job_id: string
          latitude: number
          longitude: number
          user_id: string
          validation_flags: string[] | null
          verification_type: string
        }
        Insert: {
          accuracy_meters?: number | null
          company_id: string
          created_at?: string
          device_info?: Json | null
          distance_to_job_meters?: number | null
          id?: string
          is_valid?: boolean | null
          job_id: string
          latitude: number
          longitude: number
          user_id: string
          validation_flags?: string[] | null
          verification_type?: string
        }
        Update: {
          accuracy_meters?: number | null
          company_id?: string
          created_at?: string
          device_info?: Json | null
          distance_to_job_meters?: number | null
          id?: string
          is_valid?: boolean | null
          job_id?: string
          latitude?: number
          longitude?: number
          user_id?: string
          validation_flags?: string[] | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "gps_verifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gps_verifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gps_verifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "v_jobs_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          assigned_to: string | null
          company_id: string
          created_at: string
          customer_id: string
          estimated_duration_minutes: number | null
          final_price: number | null
          id: string
          internal_notes: string | null
          is_recurring: boolean | null
          job_number: string
          notes: string | null
          priority: number | null
          quoted_price: number | null
          scheduled_date: string
          scheduled_time_end: string | null
          scheduled_time_start: string | null
          service_type: string
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string
          customer_id: string
          estimated_duration_minutes?: number | null
          final_price?: number | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          job_number: string
          notes?: string | null
          priority?: number | null
          quoted_price?: number | null
          scheduled_date: string
          scheduled_time_end?: string | null
          scheduled_time_start?: string | null
          service_type?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          customer_id?: string
          estimated_duration_minutes?: number | null
          final_price?: number | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          job_number?: string
          notes?: string | null
          priority?: number | null
          quoted_price?: number | null
          scheduled_date?: string
          scheduled_time_end?: string | null
          scheduled_time_start?: string | null
          service_type?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_jobs_assigned_profile"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_jobs_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_jobs_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_jobs_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          base_price_cents: number
          company_id: string
          created_at: string
          current_price_cents: number
          description: string | null
          dynamic_pricing_enabled: boolean | null
          end_time: string | null
          expires_at: string | null
          filled_at: string | null
          filled_by: string | null
          id: string
          job_id: string
          listing_date: string
          start_time: string | null
          status: string
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          base_price_cents?: number
          company_id: string
          created_at?: string
          current_price_cents?: number
          description?: string | null
          dynamic_pricing_enabled?: boolean | null
          end_time?: string | null
          expires_at?: string | null
          filled_at?: string | null
          filled_by?: string | null
          id?: string
          job_id: string
          listing_date: string
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          base_price_cents?: number
          company_id?: string
          created_at?: string
          current_price_cents?: number
          description?: string | null
          dynamic_pricing_enabled?: boolean | null
          end_time?: string | null
          expires_at?: string | null
          filled_at?: string | null
          filled_by?: string | null
          id?: string
          job_id?: string
          listing_date?: string
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "v_jobs_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          actual_distance_miles: number | null
          actual_duration_minutes: number | null
          actual_fuel_cost_cents: number | null
          company_id: string
          created_at: string
          estimated_distance_miles: number | null
          estimated_duration_minutes: number | null
          estimated_fuel_cost_cents: number | null
          id: string
          is_optimized: boolean | null
          job_ids: string[]
          job_order: number[] | null
          name: string
          optimization_algorithm: string | null
          route_date: string
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          actual_distance_miles?: number | null
          actual_duration_minutes?: number | null
          actual_fuel_cost_cents?: number | null
          company_id: string
          created_at?: string
          estimated_distance_miles?: number | null
          estimated_duration_minutes?: number | null
          estimated_fuel_cost_cents?: number | null
          id?: string
          is_optimized?: boolean | null
          job_ids?: string[]
          job_order?: number[] | null
          name: string
          optimization_algorithm?: string | null
          route_date: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_distance_miles?: number | null
          actual_duration_minutes?: number | null
          actual_fuel_cost_cents?: number | null
          company_id?: string
          created_at?: string
          estimated_distance_miles?: number | null
          estimated_duration_minutes?: number | null
          estimated_fuel_cost_cents?: number | null
          id?: string
          is_optimized?: boolean | null
          job_ids?: string[]
          job_order?: number[] | null
          name?: string
          optimization_algorithm?: string | null
          route_date?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          is_leader: boolean | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_leader?: boolean | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_leader?: boolean | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_members_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean | null
          max_jobs_per_day: number | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_jobs_per_day?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_jobs_per_day?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teams_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          check_in: string | null
          check_in_lat: number | null
          check_in_lng: number | null
          check_out: string | null
          check_out_lat: number | null
          check_out_lng: number | null
          company_id: string
          created_at: string
          id: string
          job_id: string
          notes: string | null
          status: string
          total_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_out?: string | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          company_id: string
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          status?: string
          total_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_out?: string | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          company_id?: string
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          status?: string
          total_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_timesheets_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_timesheets_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_timesheets_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "v_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_timesheets_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_jobs_dashboard: {
        Row: {
          assigned_name: string | null
          company_id: string | null
          customer_name: string | null
          id: string | null
          job_number: string | null
          property_address: string | null
          quoted_price: number | null
          scheduled_date: string | null
          status: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_jobs_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_company_id: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_manager: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "team_lead" | "cleaner" | "owner"
      job_service_type:
        | "standard_clean"
        | "deep_clean"
        | "move_in_out"
        | "post_construction"
        | "office"
        | "window_cleaning"
        | "carpet_cleaning"
      job_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "team_lead", "cleaner", "owner"],
      job_service_type: [
        "standard_clean",
        "deep_clean",
        "move_in_out",
        "post_construction",
        "office",
        "window_cleaning",
        "carpet_cleaning",
      ],
      job_status: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "archived",
      ],
    },
  },
} as const

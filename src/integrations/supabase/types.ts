export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      company_logos: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_logos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      receipt_templates: {
        Row: {
          config: Json
          created_at: string
          default_data: Json | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          default_data?: Json | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          default_data?: Json | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipt_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          auth_number: string
          beneficiary_account: string | null
          beneficiary_agency: string | null
          beneficiary_bank: string | null
          beneficiary_document: string | null
          beneficiary_name: string | null
          beneficiary_pix_key: string | null
          boleto_barcode: string | null
          boleto_discount: number | null
          boleto_document: string | null
          boleto_document_value: number | null
          boleto_due_date: string | null
          boleto_fine: number | null
          boleto_interest: number | null
          boleto_payment_date: string | null
          created_at: string
          description: string | null
          end_to_end: string | null
          fees: number | null
          id: string
          logo_id: string | null
          payer_account: string
          payer_agency: string
          payer_bank: string
          payer_document: string
          payer_name: string
          payment_date: string
          payment_type: string
          status: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          auth_number: string
          beneficiary_account?: string | null
          beneficiary_agency?: string | null
          beneficiary_bank?: string | null
          beneficiary_document?: string | null
          beneficiary_name?: string | null
          beneficiary_pix_key?: string | null
          boleto_barcode?: string | null
          boleto_discount?: number | null
          boleto_document?: string | null
          boleto_document_value?: number | null
          boleto_due_date?: string | null
          boleto_fine?: number | null
          boleto_interest?: number | null
          boleto_payment_date?: string | null
          created_at?: string
          description?: string | null
          end_to_end?: string | null
          fees?: number | null
          id?: string
          logo_id?: string | null
          payer_account: string
          payer_agency: string
          payer_bank: string
          payer_document: string
          payer_name: string
          payment_date: string
          payment_type: string
          status: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          auth_number?: string
          beneficiary_account?: string | null
          beneficiary_agency?: string | null
          beneficiary_bank?: string | null
          beneficiary_document?: string | null
          beneficiary_name?: string | null
          beneficiary_pix_key?: string | null
          boleto_barcode?: string | null
          boleto_discount?: number | null
          boleto_document?: string | null
          boleto_document_value?: number | null
          boleto_due_date?: string | null
          boleto_fine?: number | null
          boleto_interest?: number | null
          boleto_payment_date?: string | null
          created_at?: string
          description?: string | null
          end_to_end?: string | null
          fees?: number | null
          id?: string
          logo_id?: string | null
          payer_account?: string
          payer_agency?: string
          payer_bank?: string
          payer_document?: string
          payer_name?: string
          payment_date?: string
          payment_type?: string
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "company_logos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "receipt_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

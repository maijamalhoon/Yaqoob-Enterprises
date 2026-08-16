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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: number
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          record_label: string | null
          reverted_at: string | null
          reverted_by: string | null
          table_name: string
        }
        Insert: {
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          record_label?: string | null
          reverted_at?: string | null
          reverted_by?: string | null
          table_name: string
        }
        Update: {
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          record_label?: string | null
          reverted_at?: string | null
          reverted_by?: string | null
          table_name?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_snapshots: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          label: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string
          snapshot?: Json
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          city_name: string | null
          country_code: string | null
          created_at: string
          device_type: string | null
          event_name: string
          id: number
          page_path: string
          referrer_host: string | null
          session_hash: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          city_name?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          event_name: string
          id?: never
          page_path?: string
          referrer_host?: string | null
          session_hash?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          city_name?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          event_name?: string
          id?: never
          page_path?: string
          referrer_host?: string | null
          session_hash?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          created_at: string
          display_order: number
          ends_at: string | null
          id: string
          is_active: boolean
          link_label: string | null
          link_url: string | null
          message: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          message: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          message?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          closes_at: string | null
          display_order: number
          id: string
          is_closed: boolean
          label: string
          opens_at: string | null
          periods: Json
          updated_at: string
          weekday: number
        }
        Insert: {
          closes_at?: string | null
          display_order: number
          id?: string
          is_closed?: boolean
          label: string
          opens_at?: string | null
          periods?: Json
          updated_at?: string
          weekday: number
        }
        Update: {
          closes_at?: string | null
          display_order?: number
          id?: string
          is_closed?: boolean
          label?: string
          opens_at?: string | null
          periods?: Json
          updated_at?: string
          weekday?: number
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string
          business_name: string
          concept_image_notice: string
          google_business_profile_url: string
          id: boolean
          map_url: string
          phone_display: string
          phone_e164: string
          pricing_message: string
          tagline: string
          updated_at: string
          website_active: boolean
          whatsapp_e164: string
        }
        Insert: {
          address?: string
          business_name?: string
          concept_image_notice?: string
          google_business_profile_url?: string
          id?: boolean
          map_url?: string
          phone_display?: string
          phone_e164?: string
          pricing_message?: string
          tagline?: string
          updated_at?: string
          website_active?: boolean
          whatsapp_e164?: string
        }
        Update: {
          address?: string
          business_name?: string
          concept_image_notice?: string
          google_business_profile_url?: string
          id?: boolean
          map_url?: string
          phone_display?: string
          phone_e164?: string
          pricing_message?: string
          tagline?: string
          updated_at?: string
          website_active?: boolean
          whatsapp_e164?: string
        }
        Relationships: []
      }
      coverage_areas: {
        Row: {
          created_at: string
          delivery_available: boolean
          display_order: number
          doorstep_biometric_available: boolean
          extra_charge_may_apply: boolean
          id: string
          is_active: boolean
          name: string
          notes: string
          pickup_available: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_available?: boolean
          display_order?: number
          doorstep_biometric_available?: boolean
          extra_charge_may_apply?: boolean
          id?: string
          is_active?: boolean
          name: string
          notes?: string
          pickup_available?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_available?: boolean
          display_order?: number
          doorstep_biometric_available?: boolean
          extra_charge_may_apply?: boolean
          id?: string
          is_active?: boolean
          name?: string
          notes?: string
          pickup_available?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          display_order: number
          focal_x: number
          focal_y: number
          id: string
          is_active: boolean
          is_featured: boolean
          media_kind: Database["public"]["Enums"]["media_kind"]
          storage_path: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          caption?: string
          created_at?: string
          display_order?: number
          focal_x?: number
          focal_y?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          media_kind?: Database["public"]["Enums"]["media_kind"]
          storage_path: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          display_order?: number
          focal_x?: number
          focal_y?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          media_kind?: Database["public"]["Enums"]["media_kind"]
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon_key: string
          id: string
          is_active: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          icon_key?: string
          id?: string
          is_active?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon_key?: string
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          appointment_required: boolean
          available_at_shop: boolean
          category_id: string
          created_at: string
          delivery_available: boolean
          detailed_description: string
          display_order: number
          doorstep_available: boolean
          id: string
          important_note: string
          is_featured: boolean
          pickup_available: boolean
          requirements: string[]
          seo_description: string | null
          seo_title: string | null
          short_description: string
          slug: string
          status: Database["public"]["Enums"]["service_status"]
          title: string
          updated_at: string
          whatsapp_request: boolean
        }
        Insert: {
          appointment_required?: boolean
          available_at_shop?: boolean
          category_id: string
          created_at?: string
          delivery_available?: boolean
          detailed_description?: string
          display_order?: number
          doorstep_available?: boolean
          id?: string
          important_note?: string
          is_featured?: boolean
          pickup_available?: boolean
          requirements?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description: string
          slug: string
          status?: Database["public"]["Enums"]["service_status"]
          title: string
          updated_at?: string
          whatsapp_request?: boolean
        }
        Update: {
          appointment_required?: boolean
          available_at_shop?: boolean
          category_id?: string
          created_at?: string
          delivery_available?: boolean
          detailed_description?: string
          display_order?: number
          doorstep_available?: boolean
          id?: string
          important_note?: string
          is_featured?: boolean
          pickup_available?: boolean
          requirements?: string[]
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string
          slug?: string
          status?: Database["public"]["Enums"]["service_status"]
          title?: string
          updated_at?: string
          whatsapp_request?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_sections: {
        Row: {
          body: string
          content: Json
          id: string
          is_active: boolean
          section_key: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          content?: Json
          id?: string
          is_active?: boolean
          section_key: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          content?: Json
          id?: string
          is_active?: boolean
          section_key?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_archive_gallery_image: {
        Args: { p_id: string }
        Returns: string
      }
      admin_complete_gallery_upload: {
        Args: {
          p_alt_text: string
          p_display_order: number
          p_focal_x: number
          p_focal_y: number
          p_is_featured: boolean
          p_media_kind: Database["public"]["Enums"]["media_kind"]
          p_storage_path: string
        }
        Returns: string
      }
      admin_update_gallery_image: {
        Args: {
          p_alt_text: string
          p_display_order: number
          p_focal_x: number
          p_focal_y: number
          p_id: string
          p_is_active: boolean
          p_is_featured: boolean
          p_media_kind: Database["public"]["Enums"]["media_kind"]
        }
        Returns: string
      }
      restore_admin_snapshot: {
        Args: { target_snapshot_id: string }
        Returns: undefined
      }
      rollback_admin_audit: {
        Args: { target_audit_id: number }
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "owner" | "editor"
      media_kind: "concept" | "real"
      service_status:
        | "active"
        | "appointment_only"
        | "temporarily_unavailable"
        | "coming_soon"
        | "hidden"
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
      admin_role: ["owner", "editor"],
      media_kind: ["concept", "real"],
      service_status: [
        "active",
        "appointment_only",
        "temporarily_unavailable",
        "coming_soon",
        "hidden",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          added_by_trustee_id: string | null
          custodian_notes: string | null
          date_added: string | null
          description: string | null
          id: string
          identifier: string | null
          last_updated: string | null
          name: string
          type: Database["public"]["Enums"]["asset_type"]
          value_currency: string | null
          value_current: number | null
        }
        Insert: {
          added_by_trustee_id?: string | null
          custodian_notes?: string | null
          date_added?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          last_updated?: string | null
          name: string
          type: Database["public"]["Enums"]["asset_type"]
          value_currency?: string | null
          value_current?: number | null
        }
        Update: {
          added_by_trustee_id?: string | null
          custodian_notes?: string | null
          date_added?: string | null
          description?: string | null
          id?: string
          identifier?: string | null
          last_updated?: string | null
          name?: string
          type?: Database["public"]["Enums"]["asset_type"]
          value_currency?: string | null
          value_current?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_added_by_trustee_id_fkey"
            columns: ["added_by_trustee_id"]
            isOneToOne: false
            referencedRelation: "trustees"
            referencedColumns: ["id"]
          },
        ]
      }
      b0ase_tasks: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          order_val: number | null
          project_scope_id: string | null
          source_diary_action_item_id: string | null
          status: string
          text: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          order_val?: number | null
          project_scope_id?: string | null
          source_diary_action_item_id?: string | null
          status?: string
          text: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          order_val?: number | null
          project_scope_id?: string | null
          source_diary_action_item_id?: string | null
          status?: string
          text?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_scope"
            columns: ["project_scope_id"]
            isOneToOne: false
            referencedRelation: "project_scopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_source_diary_action_item"
            columns: ["source_diary_action_item_id"]
            isOneToOne: false
            referencedRelation: "diary_action_items"
            referencedColumns: ["id"]
          },
        ]
      }
      briefs: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          requirements: Json | null
          submitted_by: string | null
          summary: string | null
          updated_at: string | null
          vision: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          requirements?: Json | null
          submitted_by?: string | null
          summary?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          requirements?: Json | null
          submitted_by?: string | null
          summary?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_project_logins: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          project_slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          project_slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          project_slug?: string
        }
        Relationships: []
      }
      client_requests: {
        Row: {
          created_at: string | null
          email: string
          github_links: string | null
          how_heard: string | null
          id: string
          inspiration_links: string | null
          logo_url: string | null
          name: string
          phone: string | null
          project_brief: string | null
          project_types: string[] | null
          rejection_reason: string | null
          requested_budget: number | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          socials: string | null
          status: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          github_links?: string | null
          how_heard?: string | null
          id?: string
          inspiration_links?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          project_brief?: string | null
          project_types?: string[] | null
          rejection_reason?: string | null
          requested_budget?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          socials?: string | null
          status?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          github_links?: string | null
          how_heard?: string | null
          id?: string
          inspiration_links?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          project_brief?: string | null
          project_types?: string[] | null
          rejection_reason?: string | null
          requested_budget?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          socials?: string | null
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          badge1: string | null
          badge2: string | null
          badge3: string | null
          badge4: string | null
          badge5: string | null
          banner_url: string | null
          created_at: string | null
          custom_project_type_details: string | null
          email: string | null
          github_repo_url: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          name: string
          notes: string | null
          password_hash: string | null
          phone: string | null
          preview_deployment_url: string | null
          preview_url: string | null
          project_brief: string | null
          project_category: string | null
          project_description: string | null
          project_slug: string
          repo_url: string | null
          slug: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          badge1?: string | null
          badge2?: string | null
          badge3?: string | null
          badge4?: string | null
          badge5?: string | null
          banner_url?: string | null
          created_at?: string | null
          custom_project_type_details?: string | null
          email?: string | null
          github_repo_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name: string
          notes?: string | null
          password_hash?: string | null
          phone?: string | null
          preview_deployment_url?: string | null
          preview_url?: string | null
          project_brief?: string | null
          project_category?: string | null
          project_description?: string | null
          project_slug: string
          repo_url?: string | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          badge1?: string | null
          badge2?: string | null
          badge3?: string | null
          badge4?: string | null
          badge5?: string | null
          banner_url?: string | null
          created_at?: string | null
          custom_project_type_details?: string | null
          email?: string | null
          github_repo_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          notes?: string | null
          password_hash?: string | null
          phone?: string | null
          preview_deployment_url?: string | null
          preview_url?: string | null
          project_brief?: string | null
          project_category?: string | null
          project_description?: string | null
          project_slug?: string
          repo_url?: string | null
          slug?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cv_metadata: {
        Row: {
          application_id: string | null
          content_type: string | null
          created_at: string
          file_name: string | null
          file_path: string
          file_size_bytes: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_path: string
          file_size_bytes?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_path?: string
          file_size_bytes?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      diary_action_items: {
        Row: {
          created_at: string
          diary_entry_id: string
          id: string
          is_completed: boolean
          order_val: number | null
          sent_to_wip_at: string | null
          text: string
          user_id: string
          wip_task_id: string | null
        }
        Insert: {
          created_at?: string
          diary_entry_id: string
          id?: string
          is_completed?: boolean
          order_val?: number | null
          sent_to_wip_at?: string | null
          text: string
          user_id: string
          wip_task_id?: string | null
        }
        Update: {
          created_at?: string
          diary_entry_id?: string
          id?: string
          is_completed?: boolean
          order_val?: number | null
          sent_to_wip_at?: string | null
          text?: string
          user_id?: string
          wip_task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_action_items_diary_entry_id_fkey"
            columns: ["diary_entry_id"]
            isOneToOne: false
            referencedRelation: "diary_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_action_items_wip_task_id_fkey"
            columns: ["wip_task_id"]
            isOneToOne: false
            referencedRelation: "b0ase_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          created_at: string
          entry_timestamp: string
          id: string
          summary: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_timestamp?: string
          id?: string
          summary: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_timestamp?: string
          id?: string
          summary?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_task_links: {
        Row: {
          created_at: string
          diary_entry_id: string | null
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          diary_entry_id?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          diary_entry_id?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_task_links_diary_entry_id_fkey"
            columns: ["diary_entry_id"]
            isOneToOne: false
            referencedRelation: "diary_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_task_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "b0ase_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          asset_id: string | null
          description: string | null
          file_name: string
          id: string
          storage_path: string
          uploaded_at: string | null
          uploaded_by_trustee_id: string | null
        }
        Insert: {
          asset_id?: string | null
          description?: string | null
          file_name: string
          id?: string
          storage_path: string
          uploaded_at?: string | null
          uploaded_by_trustee_id?: string | null
        }
        Update: {
          asset_id?: string | null
          description?: string | null
          file_name?: string
          id?: string
          storage_path?: string
          uploaded_at?: string | null
          uploaded_by_trustee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_trustee_id_fkey"
            columns: ["uploaded_by_trustee_id"]
            isOneToOne: false
            referencedRelation: "trustees"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_checklists: {
        Row: {
          feature: string
          id: string
          notes: string | null
          price: number | null
          project_id: string | null
          selected: boolean | null
        }
        Insert: {
          feature: string
          id?: string
          notes?: string | null
          price?: number | null
          project_id?: string | null
          selected?: boolean | null
        }
        Update: {
          feature?: string
          id?: string
          notes?: string | null
          price?: number | null
          project_id?: string | null
          selected?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_details: Json | null
          account_type: string
          created_at: string | null
          currency_code: string | null
          current_balance: number | null
          id: string
          name: string
          notes: string | null
          open_banking_item_id: string | null
          provider_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_details?: Json | null
          account_type: string
          created_at?: string | null
          currency_code?: string | null
          current_balance?: number | null
          id?: string
          name: string
          notes?: string | null
          open_banking_item_id?: string | null
          provider_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_details?: Json | null
          account_type?: string
          created_at?: string | null
          currency_code?: string | null
          current_balance?: number | null
          id?: string
          name?: string
          notes?: string | null
          open_banking_item_id?: string | null
          provider_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      project_features: {
        Row: {
          approved: boolean | null
          completed: boolean | null
          created_at: string | null
          est_cost: number | null
          feature: string
          id: string
          priority: string | null
          project_slug: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          est_cost?: number | null
          feature: string
          id?: string
          priority?: string | null
          project_slug: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          est_cost?: number | null
          feature?: string
          id?: string
          priority?: string | null
          project_slug?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_features_project_slug_fkey"
            columns: ["project_slug"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["slug"]
          },
        ]
      }
      project_memberships: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string | null
          project_client_id: string
          role: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          project_client_id: string
          role?: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          project_client_id?: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_memberships_project_client_id_fkey"
            columns: ["project_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      project_scopes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          scope_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          scope_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          scope_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_timelines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_summary: boolean | null
          phase: string
          preview_image_url: string | null
          project_slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_summary?: boolean | null
          phase: string
          preview_image_url?: string | null
          project_slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_summary?: boolean | null
          phase?: string
          preview_image_url?: string | null
          project_slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_timelines_project_slug_fkey"
            columns: ["project_slug"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["slug"]
          },
        ]
      }
      project_treatments: {
        Row: {
          description: string | null
          id: string
          phase: string
          project_slug: string
          sort_order: number | null
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          phase: string
          project_slug: string
          sort_order?: number | null
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          phase?: string
          project_slug?: string
          sort_order?: number | null
          title?: string | null
        }
        Relationships: []
      }
      project_users: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string | null
          start_date: string | null
          status: string | null
          url: string | null
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug?: string | null
          start_date?: string | null
          status?: string | null
          url?: string | null
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string | null
          start_date?: string | null
          status?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      robust_ae_content: {
        Row: {
          data: Json
          id: number
          updated_at: string
        }
        Insert: {
          data: Json
          id?: number
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      robust_ae_feedback: {
        Row: {
          approved: boolean | null
          comment: string | null
          day: number
          id: number
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          comment?: string | null
          day: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          comment?: string | null
          day?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      team_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_messages_user_id_to_profiles_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_mesaages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color_scheme: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color_scheme?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color_scheme?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      todo_comments: {
        Row: {
          comment_text: string
          created_at: string
          id: string
          todo_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string
          id?: string
          todo_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string
          id?: string
          todo_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_comments_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean
          project_id: string | null
          task: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean
          project_id?: string | null
          task: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean
          project_id?: string | null
          task?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_categories: {
        Row: {
          color_hex: string | null
          created_at: string | null
          icon_name: string | null
          id: string
          is_system_default: boolean | null
          name: string
          parent_category_id: string | null
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_system_default?: boolean | null
          name: string
          parent_category_id?: string | null
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_system_default?: boolean | null
          name?: string
          parent_category_id?: string | null
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency_code: string
          description: string
          financial_account_id: string
          id: string
          is_recurring: boolean | null
          merchant_name: string | null
          notes: string | null
          source_data: Json | null
          status: string | null
          transaction_category_id: string | null
          transaction_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency_code: string
          description: string
          financial_account_id: string
          id?: string
          is_recurring?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          source_data?: Json | null
          status?: string | null
          transaction_category_id?: string | null
          transaction_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency_code?: string
          description?: string
          financial_account_id?: string
          id?: string
          is_recurring?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          source_data?: Json | null
          status?: string | null
          transaction_category_id?: string | null
          transaction_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_financial_account_id_fkey"
            columns: ["financial_account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_transaction_category_id_fkey"
            columns: ["transaction_category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trustees: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          description: string | null
          file_type: string | null
          file_url: string
          id: string
          project_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          description?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          project_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          description?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          project_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_google_tokens: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          refresh_token: string
          scopes: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          refresh_token: string
          scopes?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          refresh_token?: string
          scopes?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_project_memberships: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_project_memberships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_team_memberships: {
        Row: {
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trust_access: {
        Row: {
          can_access_trust_module: boolean
          granted_at: string | null
          granted_by_user_id: string | null
          user_id: string
        }
        Insert: {
          can_access_trust_module?: boolean
          granted_at?: string | null
          granted_by_user_id?: string | null
          user_id: string
        }
        Update: {
          can_access_trust_module?: boolean
          granted_at?: string | null
          granted_by_user_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_team_members_with_profiles: {
        Args: { p_team_id: string }
        Returns: {
          id: string
          displayName: string
          avatarUrl: string
        }[]
      }
      is_team_owner: {
        Args: { team_id_to_check: string }
        Returns: boolean
      }
      is_user_project_manager: {
        Args: { user_id_to_check: string; project_id_to_check: string }
        Returns: boolean
      }
    }
    Enums: {
      asset_type:
        | "crypto_spot"
        | "crypto_timelocked"
        | "rwa_nft"
        | "rwa_physical_tokenized"
      asset_type_enum:
        | "crypto_spot"
        | "crypto_timelocked"
        | "rwa_nft"
        | "rwa_physical_tokenized"
        | "other"
      project_role:
        | "project_manager"
        | "collaborator"
        | "client_contact"
        | "viewer"
        | "member"
      team_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: [
        "crypto_spot",
        "crypto_timelocked",
        "rwa_nft",
        "rwa_physical_tokenized",
      ],
      asset_type_enum: [
        "crypto_spot",
        "crypto_timelocked",
        "rwa_nft",
        "rwa_physical_tokenized",
        "other",
      ],
      project_role: [
        "project_manager",
        "collaborator",
        "client_contact",
        "viewer",
        "member",
      ],
      team_role: ["owner", "admin", "member"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image: string | null
          category_id: string | null
          reading_time: number | null
          created_at: string
          updated_at: string
          published_at: string | null
          author_id: string | null
          meta_title: string | null
          meta_description: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image?: string | null
          category_id?: string | null
          reading_time?: number | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image?: string | null
          category_id?: string | null
          reading_time?: number | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          fingerprint: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          fingerprint: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          fingerprint?: string
          created_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          is_active: boolean
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          is_active?: boolean
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          is_active?: boolean
          unsubscribed_at?: string | null
        }
        Relationships: []
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

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']

export type PostTag = Database['public']['Tables']['post_tags']['Row']

export type PostLike = Database['public']['Tables']['post_likes']['Row']
export type PostLikeInsert = Database['public']['Tables']['post_likes']['Insert']

export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert']

export type PostWithCategory = Post & {
  category: Category | null
}

export type PostWithTags = Post & {
  tags: Tag[]
}

export type PostWithAll = Post & {
  category: Category | null
  tags: Tag[]
  likes_count?: number
}

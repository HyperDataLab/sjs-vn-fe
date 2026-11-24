/**
 * Core Academic & System Domain Models
 */

export interface AuthorAffiliation {
  institution_id?: string | number;
  display_name: string;
  country_code?: string;
  ror?: string;
}

export interface Author {
  id: string | number;
  display_name: string;
  orcid?: string | null;
  h_index?: number | null;
  works_count?: number;
  cited_by_count?: number;
  affiliations?: AuthorAffiliation[];
  last_known_institution?: string | null;
}

export interface Institution {
  id: string | number;
  display_name: string;
  country_code?: string;
  ror?: string | null;
  works_count?: number;
  cited_by_count?: number;
  type?: string;
}

export type Quartile = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'N/A';

export interface JournalMetrics {
  sjr?: number | null;
  h_index?: number | null;
  impact_factor?: number | null;
  cites_per_doc?: number | null;
  quartile?: Quartile;
}

export interface Journal {
  id: string | number;
  title: string;
  issn?: string | null;
  publisher?: string | null;
  metrics?: JournalMetrics;
  quartile?: Quartile;
  subject_areas?: string[];
  created_at?: string;
}

export interface ArticleAuthorRef {
  author_id: string | number;
  display_name: string;
  author_position?: 'first' | 'middle' | 'last';
  is_corresponding?: boolean;
}

export interface Article {
  id: string | number;
  title: string;
  doi?: string | null;
  abstract?: string | null;
  publication_year?: number | null;
  citation_count?: number;
  reference_count?: number;
  openalex_id?: string | null;
  landing_page_url?: string | null;
  pdf_url?: string | null;
  quartile?: Quartile;
  trending_score?: number | null;
  growth_rate?: number | null;
  authors?: ArticleAuthorRef[];
  journal?: Journal | null;
  created_at?: string;
}

export interface TrendingArticle {
  article_id: string | number;
  title: string;
  doi?: string | null;
  publication_year?: number;
  current_citations: number;
  previous_citations: number;
  absolute_growth: number;
  growth_rate: number;
  smoothed_growth_rate?: number | null;
  trending_score?: number | null;
  authors?: ArticleAuthorRef[];
  journal_title?: string;
}

export interface User {
  id: string | number;
  email: string;
  full_name?: string;
  role: 'USER' | 'ADMIN' | 'RESEARCHER';
  avatar_url?: string | null;
  institution?: string | null;
  created_at?: string;
}

export interface ProjectMember {
  user_id: string | number;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  user?: User;
}

export interface Project {
  id: string | number;
  name: string;
  description?: string | null;
  owner_id: string | number;
  members?: ProjectMember[];
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Bookmark {
  id: string | number;
  user_id: string | number;
  article_id: string | number;
  note?: string | null;
  tags?: string[];
  created_at: string;
  article?: Article;
}

/**
 * API Response & Query Type Definitions
 */
import type { TrendingArticle } from './models';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ProblemDetailsError {
  field: string;
  message: string;
}

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: ProblemDetailsError[];
}

export interface TimeSeriesPoint {
  year: number;
  count: number;
}

export interface TrendingAnalyticsSummary {
  scholarly_works: number;
  total_citations: number;
  growth_percentage?: number | null;
}

export interface TrendingVNAnalysisResponse {
  scope: string;
  window: string;
  summary: TrendingAnalyticsSummary;
  works_over_time: TimeSeriesPoint[];
  citations_over_time: TimeSeriesPoint[];
  top: {
    institutions?: any[];
    authors?: any[];
    journals?: any[];
  };
  growth: {
    institutions?: any[];
    authors?: any[];
    journals?: any[];
  };
  trending_articles: TrendingArticle[];
  trending_article_coverage?: {
    total_articles: number;
    with_scores: number;
  };
}

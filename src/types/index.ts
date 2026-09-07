export interface ContactInfo {
  contact_data: string;
  contact_info_id: string;
  contact_tag: string;
  contact_title: string;
  contact_type: string;
  description: string;
  id: string;
  is_deleted: boolean;
  is_primary: boolean;
  phone_country_code: string | null;
}

export interface ExtraInfo {
  key: string;
  value: string;
}

export interface LocationItem {
  city?: string;
  coordinates?: string[];
  country?: string;
  state?: string;
  street?: string;
}

export type Facilities = Record<string, boolean>;

export interface LocationObj {
  LGA: any[];
  area: any[];
  city?: string[];
  country?: string[];
  state?: string[];
  street?: string[];
  [k: string]: any;
}

export interface SearchItem {
  id: string;
  business_name?: string;
  categories?: string[];
  contact_infos?: ContactInfo[];
  date_created?: number;
  default_currency_code?: string;
  discount?: number;
  extra_infos?: ExtraInfo[];
  facilities?: Facilities;
  geo_location?: string[];
  is_active?: boolean;
  is_approved?: boolean;
  is_deleted?: boolean;
  is_featured?: boolean;
  last_updated?: number;
  likes?: number;
  location_obj?: LocationObj;
  locations?: LocationItem[];
  minprice?: number;
  num_of_images?: number;
  photos?: string[];
  ranking5?: number;
  rating_avg?: number;
  reviews_count?: number;
  state_facet?: string[];
  street_facet?: string[];
  total_sales?: number;
  unique_id?: string;
  unique_url_slug?: string;
  [k: string]: any;
}

export interface SearchAPIResponse {
  filters: Record<string, any>;
  total_results: number;
  page: number;
  per_page: number;
  results: SearchItem[];
}

// keep existing alias used by the app
export type SearchResult = SearchItem;
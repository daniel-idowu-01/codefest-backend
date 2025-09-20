export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_number?: number;
  opening_hours?: {
    open_now: boolean;
  };
  types: string[];
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: string;
    width: number;
  }>;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
}

export interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      close: { day: number; time: string };
      open: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number
  user_ratings_total?: number
  types: string[]
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }> 
}

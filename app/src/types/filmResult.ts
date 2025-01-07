export interface FilmSuggestion {
  title: string;
  film_id: number;
}

export interface FilmResult extends FilmSuggestion {
  description?: string;
  release_year?: string;
}

export interface Film {
  film_id: number;
  title: string;
  description: string;
  release_year: number;
  language_id: number;
  rental_duration: number;
  rental_rate: string;
  length: number;
  replacement_cost: string;
  rating: string;
  last_update: string;
  special_features: string;
  fulltext: string;
}

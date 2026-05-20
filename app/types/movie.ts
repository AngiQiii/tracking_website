export type MovieType = "movie" | "series" | "one-shot";

export type RelatedItem = {
  id: string;
  name: string;
  type: MovieType;
};

export type Movie = {
  id: string;
  type: MovieType;
  title: string;
  status: string;
  rating: number;
  moreEpisodes: boolean;
  seasons: number | null;
  relatedItems: RelatedItem[];
  createdAt?: string;
};

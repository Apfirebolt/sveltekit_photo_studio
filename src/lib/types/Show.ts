interface Schedule {
  time: string;
  days: string[];
}

interface Rating {
  average: number | null;
}

interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Network {
  id: number;
  name: string;
  country: Country | null;
  officialSite: string | null;
}

interface Externals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

interface Image {
  medium: string | null;
  original: string | null;
}

interface Links {
  self: {
    href: string;
  };
  previousepisode?: {
    // Optional property
    href: string;
    name: string;
  };
}

interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network | null;
  webChannel: Network | null; // Assuming webChannel has the same structure as network
  dvdCountry: Country | null;
  externals: Externals;
  image: Image | null;
  summary: string | null;
  updated: number;
  _links: Links;
}

interface ImageResolution {
  url: string;
  width: number;
  height: number;
}

interface ShowImage {
  id: number;
  type: string;
  main: boolean;
  resolutions: {
    original: ImageResolution;
    medium?: ImageResolution; // Optional property
  };
}

// Type for the response from your getShows function
interface ApiResponse<T> {
  status: number;
  data: T;
  // You might want to include other properties from the Response object if needed
}

interface SearchResult {
  score: number;
  show: Show;
}

export type { Show, ShowImage, SearchResult, ApiResponse };


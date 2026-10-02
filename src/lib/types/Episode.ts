interface Episode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: number | null;
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  _links: {
    self: {
      href: string;
    };
    show: {
      href: string;
      name: string;
    };
  };
}

// Type for the response from your getShows function
interface ApiResponse<T> {
  status: number;
  data: T;
  // You might want to include other properties from the Response object if needed
}

interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Network {
  id: number;
  name: string;
  country: Country;
  officialSite: string;
}

interface WebChannel {
  id: number;
  name: string;
  country: Country;
  officialSite: string;
}

interface Image {
  medium: string;
  original: string;
}

interface Season {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate: string;
  endDate: string;
  network: Network | null;
  webChannel: WebChannel | null;
  image: Image | null;
  summary: string;
  _links: {
    self: {
      href: string;
    };
  };
}

export type { Episode, Season, ApiResponse };

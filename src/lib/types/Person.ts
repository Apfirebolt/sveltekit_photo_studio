interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Person {
  id: number;
  url: string;
  name: string;
  country: Country | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  image: {
    medium: string;
    original: string;
  } | null;
  updated: number;
  _links: {
    self: {
      href: string;
    };
  };
}

interface Character {
    id: number;
    url: string;
    name: string;
    image: {
        medium: string;
        original: string;
    } | null;
    _links: {
        self: {
            href: string;
        };
    };
}

interface Cast {
    person: Person;
    character: Character;
    self: boolean;
    voice: boolean;
}

interface SearchResult {
  score: number;
  person: Person;
}

interface ApiResponse<T> {
  status: number;
  data: T;
  // You might want to include other properties from the Response object if needed
}

interface Crew {
  type: string;
  person: Person;
}

export type { Person, Crew, Cast, SearchResult, ApiResponse };
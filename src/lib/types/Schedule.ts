import type { Show } from './Show';

interface Schedule {
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
    image: string | null;
    summary: string | null;
    show: Show;
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

export type { Schedule };

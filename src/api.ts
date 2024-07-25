const BASE_URL = 'https://movies-api.nomadcoders.workers.dev';

export function getPopular() {
  return fetch(`${BASE_URL}/popular`).then((r) => r.json());
}

export function getNowPlaying() {
  return fetch(`${BASE_URL}/now-playing`).then((r) => r.json());
}

export function getComingSoon() {
  return fetch(`${BASE_URL}/coming-soon`).then((r) => r.json());
}

export function getMovie(id: string) {
  return fetch(`${BASE_URL}/movie?id=${id}`).then((r) => r.json());
}

export function makeImagePath(image: string) {
  return `https://image.tmdb.org/t/p/w500${image}`;
}

export function makeBgPath(image: string) {
  return `https://image.tmdb.org/t/p/original${image}`;
}

export interface IGetMoviesResult {
  results: IMoive[];
}

export interface IMoive {
  backdrop_path: string;
  homepage?: string;
  id: number;
  title: string;
  overview: string | undefined;
  poster_path: string;
  release_date: string;
  runtime?: number;
  video?: boolean;
  vote_average?: number;
}

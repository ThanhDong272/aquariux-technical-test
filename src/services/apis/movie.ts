import dayjs from "dayjs";
import { CommonService } from "./common";

export type MovieType = {
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
};

export type MovieResponse = {
  page: number;
  results: MovieType[];
  totalPages: number;
  totalResults: number;
};

export type MovieDetailType = {
  adult: boolean;
  backdropPath: string;
  belongsToCollection: {
    backdropPath: string;
    id: number;
    name: string;
    posterPath: string;
  } | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdbId: string;
  originCountry: string[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies: {
    id: number;
    logoPath: string | null;
    name: string;
    originCountry: string;
  }[];
  productionCountries: { iso31661: string; name: string }[];
  releaseDate: string;
  releaseDates: any;
  revenue: number;
  runtime: number;
  spokenLanguages: { iso6391: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
};

export type MovieCast = {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  castId: number;
  character: string;
  creditId: string;
  order: number;
};

export type MovieCrew = {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  creditId: string;
  department: string;
  job: string;
};

export type MovieCreditsResponse = {
  id: number;
  cast: MovieCast[];
  crew: MovieCrew[];
};

export class MovieService extends CommonService {
  static instance: MovieService;

  constructor() {
    super();
    if (MovieService.instance) {
      return MovieService.instance;
    }
    MovieService.instance = this;
  }

  async listMovieNowPlaying({
    page,
    sort_by,
  }: {
    page: number;
    sort_by: string;
  }): Promise<MovieResponse> {
    const params = {
      page: page,
      language: "en-US",
      sort_by,
      with_release_type: "2|3",
      ["release_date.gte"]: "2025-12-01",
      ["release_date.lte"]: "2025-12-31",
      region: "US",
    };

    const data = await this.get(
      `/discover/movie?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async listMoviePopular({
    page,
    sort_by,
  }: {
    page: number;
    sort_by: string;
  }): Promise<MovieResponse> {
    const params = {
      page: page,
      language: "en-US",
      sort_by,
      ["vote_count.gte"]: 50,
    };

    const data = await this.get(
      `/discover/movie?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async listMovieUpcoming({
    page,
    sort_by,
  }: {
    page: number;
    sort_by: string;
  }): Promise<MovieResponse> {
    const params = {
      page: page,
      language: "en-US",
      sort_by,
      with_release_type: "2|3",
      ["release_date.gte"]: dayjs().format("YYYY-MM-DD"),
      ["release_date.lte"]: dayjs().add(6, "month").format("YYYY-MM-DD"),
      region: "US",
    };

    const data = await this.get(
      `/discover/movie?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async searchMovies({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<MovieResponse> {
    const params = {
      query: query,
      page: page,
      language: "en-US",
      include_adult: false,
    };
    const data = await this.get(
      `/search/movie?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async movieDetails({
    movieId,
  }: {
    movieId: number;
  }): Promise<MovieDetailType> {
    const params = {
      language: "en-US",
      append_to_response: "release_dates",
    };

    const data = await this.get(
      `/movie/${movieId}?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async movieCredits({
    movieId,
  }: {
    movieId: number;
  }): Promise<MovieCreditsResponse> {
    const params = {
      language: "en-US",
    };

    const data = await this.get(
      `/movie/${movieId}/credits?${this.createQueryParams(params)}`
    );
    return data?.data;
  }

  async movieRecommendations({
    movieId,
    page,
  }: {
    movieId: number;
    page: number;
  }): Promise<MovieResponse> {
    const params = {
      page: page,
      language: "en-US",
    };

    const data = await this.get(
      `/movie/${movieId}/recommendations?${this.createQueryParams(params)}`
    );
    return data?.data;
  }
}

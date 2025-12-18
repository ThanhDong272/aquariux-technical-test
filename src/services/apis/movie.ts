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
  }): Promise<any> {
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
    return data;
  }

  async listMoviePopular({
    page,
    sort_by,
  }: {
    page: number;
    sort_by: string;
  }): Promise<any> {
    const params = {
      page: page,
      language: "en-US",
      sort_by,
      ["vote_count.gte"]: 50,
    };

    const data = await this.get(
      `/discover/movie?${this.createQueryParams(params)}`
    );
    return data;
  }

  async listMovieUpcoming({
    page,
    sort_by,
  }: {
    page: number;
    sort_by: string;
  }): Promise<any> {
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
    return data;
  }

  async searchMovies({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<any> {
    const params = {
      query: query,
      page: page,
      language: "en-US",
      include_adult: false,
    };
    const data = await this.get(
      `/search/movie?${this.createQueryParams(params)}`
    );
    return data;
  }

  async movieDetails({ movieId }: { movieId: number }): Promise<any> {
    const params = {
      language: "en-US",
    };

    const data = await this.get(
      `/movie/${movieId}?${this.createQueryParams(params)}`
    );
    return data;
  }

  async movieCredits({ movieId }: { movieId: number }): Promise<any> {
    const params = {
      language: "en-US",
    };

    const data = await this.get(
      `/movie/${movieId}/credits?${this.createQueryParams(params)}`
    );
    return data;
  }

  async movieRecommendations({
    movieId,
    page,
  }: {
    movieId: number;
    page: number;
  }): Promise<any> {
    const params = {
      page: page,
      language: "en-US",
    };

    const data = await this.get(
      `/movie/${movieId}/recommendations?${this.createQueryParams(params)}`
    );
    return data;
  }
}

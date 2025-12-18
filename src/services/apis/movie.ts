import { CommonService } from "./common";

export class MovieService extends CommonService {
  static instance: MovieService;

  constructor() {
    super();
    if (MovieService.instance) {
      return MovieService.instance;
    }
    MovieService.instance = this;
  }

  async listMovieNowPlaying({ page }: { page: number }): Promise<any> {
    const params = {
      page: page,
      language: "en-US",
    };

    const data = await this.get(
      `/movie/now_playing?${this.createQueryParams(params)}`
    );
    return data;
  }

  async listMoviePopular({ page }: { page: number }): Promise<any> {
    const params = {
      page: page,
      language: "en-US",
    };

    const data = await this.get(
      `/movie/popular?${this.createQueryParams(params)}`
    );
    return data;
  }

  async listMovieUpcoming({ page }: { page: number }): Promise<any> {
    const params = {
      page: page,
      language: "en-US",
    };

    const data = await this.get(
      `/movie/upcoming?${this.createQueryParams(params)}`
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

import { useQuery } from "@tanstack/react-query";
import { MovieService } from "@services/apis/movie";
import { QUERY_KEYS } from "@constants/queryKeys";

export const useMoviesRecommendations = ({
  page,
  movieId,
}: {
  page: number;
  movieId: number;
}) => {
  const movies = new MovieService();

  const { data, status, error, isFetching, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MOVIES.RECOMMENDATIONS],
    queryFn: () =>
      movies.movieRecommendations({
        page: page,
        movieId: movieId,
      }),
    throwOnError: (error: any, query) => {
      console.log("error", error);
      return false;
    },
  });

  return {
    data,
    status,
    error,
    isFetching,
    refetch,
    isLoading,
  };
};

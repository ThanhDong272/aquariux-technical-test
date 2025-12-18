import { useQuery } from "@tanstack/react-query";
import { MovieService } from "@services/apis/movie";
import { QUERY_KEYS } from "@constants/queryKeys";

export const useMoviesUpcoming = ({ page }: { page: number }) => {
  const movies = new MovieService();

  const { data, status, error, isFetching, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MOVIES.UPCOMING],
    queryFn: () =>
      movies.listMovieUpcoming({
        page: page,
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

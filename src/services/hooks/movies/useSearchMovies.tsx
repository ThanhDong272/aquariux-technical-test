import { useQuery } from "@tanstack/react-query";
import { MovieService } from "@services/apis/movie";
import { QUERY_KEYS } from "@constants/queryKeys";

export const useMoviesSearch = ({
  page,
  search,
}: {
  page: number;
  search: string;
}) => {
  const movies = new MovieService();

  const { data, status, error, isFetching, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MOVIES.SEARCH, page, search],
    queryFn: () =>
      movies.searchMovies({
        page: page,
        query: search,
      }),
    enabled: Boolean((search || "").trim().length > 0),
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

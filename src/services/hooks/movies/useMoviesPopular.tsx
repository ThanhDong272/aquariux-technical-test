import { useQuery } from "@tanstack/react-query";
import { MovieService } from "@services/apis/movie";
import { QUERY_KEYS } from "@constants/queryKeys";

export const useMoviesPopular = ({
  page,
  sortBy,
}: {
  page: number;
  sortBy: string;
}) => {
  const movies = new MovieService();

  const { data, status, error, isFetching, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MOVIES.POPULAR, page, sortBy],
    queryFn: () =>
      movies.listMoviePopular({
        page: page,
        sort_by: sortBy,
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

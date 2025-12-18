import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@constants/queryKeys";
import { AccountService } from "@services/apis/account";

export const useAccountDetails = ({ accountId }: { accountId: number }) => {
  const account = new AccountService();

  const { data, status, error, isFetching, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.DETAILS],
    queryFn: () =>
      account.getAccountDetails({
        accountId: accountId,
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

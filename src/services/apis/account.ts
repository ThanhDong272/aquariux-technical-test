import { CommonService } from "./common";

export type AccountDetailResponse = {
  id: number;
  name: string;
  username: string;
  includeAdult: boolean;
  iso6391: string;
  iso31661: string;
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatarPath: string | null;
    };
  };
};

export class AccountService extends CommonService {
  static instance: AccountService;

  constructor() {
    super();
    if (AccountService.instance) {
      return AccountService.instance;
    }
    AccountService.instance = this;
  }

  async getAccountDetails({
    accountId,
  }: {
    accountId: number;
  }): Promise<AccountDetailResponse> {
    const data = await this.get(`account/${accountId}`);
    return data?.data;
  }
}

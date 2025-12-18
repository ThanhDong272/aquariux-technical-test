import { CommonService } from "./common";

export class AccountService extends CommonService {
  static instance: AccountService;

  constructor() {
    super();
    if (AccountService.instance) {
      return AccountService.instance;
    }
    AccountService.instance = this;
  }

  async getAccountDetails({ accountId }: { accountId: number }): Promise<any> {
    const data = await this.get(`account/${accountId}`);
    return data;
  }
}

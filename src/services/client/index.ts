import axios, { AxiosRequestConfig } from "axios";

import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "./Interceptor";

export const API_URL = "https://api.themoviedb.org/3"; // API base URL
export const API_IMAGE_URL = "https://image.tmdb.org/t/p/w500"; // API image base URL
const TIMEOUT = 60000; // ms

const mainAxios = axios.create({
  baseURL: API_URL,
  validateStatus(status) {
    return status >= 200 && status <= 500;
  },
  timeout: TIMEOUT,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  transitional: {
    clarifyTimeoutError: true,
  },
});
mainAxios.defaults.baseURL = API_URL;
mainAxios.interceptors.request.use(requestInterceptor, errorInterceptor);
mainAxios.interceptors.response.use(responseInterceptor, errorInterceptor);

export enum AcceptType {
  json = "application/json",
  formData = "multipart/form-data",
  urlEncode = "application/x-www-form-urlencoded",
}

const defaultHeader = {
  Accept: AcceptType.json,
  "Content-Type": AcceptType.json,
};

const formHeader = {
  Accept: AcceptType.json,
  "Content-Type": AcceptType.formData,
};

const urlEncodeHeader = {
  "Content-Type": AcceptType.urlEncode,
};

export class apiClient {
  config: AxiosRequestConfig;
  headers: any;

  constructor() {
    this.config = {};
    this.headers = {
      ...defaultHeader,
    };
  }

  get = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.get(url, {
      ...this.config,
      params: {
        ...body,
      },
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
    });
  };

  post = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
    });
  };

  postForm = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...formHeader,
        ...headers,
      },
      ...rest,
    });
  };

  postUrlEncoded = (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.post(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...urlEncodeHeader,
        ...headers,
      },
      ...rest,
    });
  };

  delete = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.delete(url, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      data: {
        ...body,
      },
      ...rest,
    });
  };

  put = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.put(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
    });
  };

  putForm = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.put(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...formHeader,
        ...headers,
      },
      ...rest,
    });
  };

  patch = (url: string, body?: any, option?: any, baseUrl?: string) => {
    option = option || {};
    const { headers, ...rest } = option;
    mainAxios.defaults.baseURL = baseUrl || API_URL;
    return mainAxios.patch(url, body, {
      ...this.config,
      headers: {
        ...this.headers,
        ...headers,
      },
      ...rest,
    });
  };
}

import { apiClient } from "../client";

export class CommonService {
  protected createQueryParams(params: any) {
    const encodeParam = (key: string, value: any) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };

    const buildParams = (prefix: any, obj: any): string[] => {
      const paramsArray = [];

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const paramKey = prefix ? prefix + "[" + key + "]" : key;

          if (typeof value === "object") {
            if (Array.isArray(value)) {
              // Handle arrays
              value.forEach((element, index) => {
                paramsArray.push(
                  encodeParam(paramKey + "[" + index + "]", element)
                );
              });
            } else {
              // Handle nested objects
              paramsArray.push(...buildParams(paramKey, value));
            }
          } else {
            paramsArray.push(encodeParam(paramKey, value));
          }
        }
      }

      return paramsArray;
    };

    return buildParams(null, params).join("&");
  }

  protected get = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().get(url, body, option, baseUrl);
  };

  protected post = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().post(url, body, option, baseUrl);
  };

  protected postForm = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().postForm(url, body, option, baseUrl);
  };

  protected put = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().put(url, body, option, baseUrl);
  };

  protected putForm = async (
    url: string,
    body?: FormData,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().putForm(url, body, option, baseUrl);
  };

  protected delete = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().delete(url, body, option, baseUrl);
  };

  protected patch = async (
    url: string,
    body?: any,
    option?: any,
    baseUrl?: string
  ) => {
    return new apiClient().patch(url, body, option, baseUrl);
  };
}

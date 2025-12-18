import { TOKEN_KEY } from "@constants/local";
import { normalizeJsonApiIfNeed } from "@utils/normalize";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  console.log(
    "Response from API: ",
    response?.request?.responseURL,
    response?.status
  );
  if (response?.data?.code >= 400) {
    console.log("Response from API error: ", response?.data);

    // need to show message from server
    let normalizeError = normalizeJsonApiIfNeed(response?.data);

    normalizeError.status = response.status.toString();
    console.log("API error: ", JSON.stringify(normalizeError));

    throw normalizeError;
  }

  let normalizeData = normalizeJsonApiIfNeed(response?.data);

  console.log("Response from API data: ", normalizeData);
  response.data = normalizeData;
  return response;
};

export const errorInterceptor = (error: AxiosError<any>) => {
  // Add type hint for error.response.data if known
  // This catches Network errors, request cancellations, or errors rejected by responseInterceptor

  // --- Handle HTTP Status Code Errors (if not handled by responseInterceptor's data.code) ---
  if (error.response) {
    console.log(
      `Error Response: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      } -> Status: ${error.response.status}`,
      error.response.data
    );

    // Reject with information from the error response
    return Promise.reject({
      status: error.response.status,
      httpStatus: error.response.status,
      message:
        error.response.data?.message ||
        `Request failed with status code ${error.response.status}`,
      ...(error.response.data
        ? normalizeJsonApiIfNeed(error.response.data)
        : {}), // Normalize if possible
    });
  }

  // Network or unexpected error without response
  return Promise.reject(error);
};

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  console.log(
    "REQUEST: ",
    config?.method,
    (config?.baseURL ?? "") + config?.url,
    config?.data
  );

  const token = TOKEN_KEY;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

import axios, { type AxiosInstance } from "axios";
import { toRestApiError } from "@/utils/restError.utils";

/** Default timeout for list/manifest and typical JSON routes. */
const API_CLIENT_TIMEOUT_MS = 30_000;

/** Align with backend `express.json({ limit: "50mb" })` on config routes. */
const API_CLIENT_MAX_BODY_BYTES = 50 * 1024 * 1024;

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerApiClientUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: undefined,
    withCredentials: true,
    timeout: API_CLIENT_TIMEOUT_MS,
    maxBodyLength: API_CLIENT_MAX_BODY_BYTES,
    maxContentLength: API_CLIENT_MAX_BODY_BYTES,
    headers: {
      Accept: "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const restError = toRestApiError(error);

      if (restError.isSessionError && unauthorizedHandler) {
        unauthorizedHandler();
      }

      return Promise.reject(restError);
    },
  );

  return client;
}

/** Shared axios instance — `baseURL` set by `ApiConfigProvider`, session cookies included. */
export const apiClient = createApiClient();

export function configureApiClientBaseUrl(baseURL: string): void {
  apiClient.defaults.baseURL = baseURL || undefined;
}

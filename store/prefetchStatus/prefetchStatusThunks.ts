import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/infra/apiClient";
import { RestApiError } from "@/infra/restApiError";
import type { GetConfigsPrefetchStatusResponseBody } from "@/types/rest.types";
import { parseGetConfigsPrefetchStatusResponseBody } from "@/utils/prefetchStatusStream.utils";

type FetchPrefetchStatusRejectValue = {
  code: string;
  message: string;
};

export const fetchPrefetchStatus = createAsyncThunk<
  GetConfigsPrefetchStatusResponseBody,
  void,
  { rejectValue: FetchPrefetchStatusRejectValue }
>("prefetchStatus/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<GetConfigsPrefetchStatusResponseBody>(
      "/api/configs/prefetch-status",
    );
    const parsed = parseGetConfigsPrefetchStatusResponseBody(data);
    if (!parsed) {
      return rejectWithValue({
        code: "PREFETCH_STATUS_PARSE_FAILED",
        message: "Invalid prefetch status response",
      });
    }
    return parsed;
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
      });
    }
    throw error;
  }
});

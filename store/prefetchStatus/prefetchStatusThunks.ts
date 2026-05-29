import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/infra/apiClient";
import { RestApiError } from "@/infra/restApiError";
import type { GetConfigsPrefetchStatusResponseBody } from "@/types/rest.types";

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
    return data;
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

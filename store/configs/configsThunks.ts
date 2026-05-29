import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/infra/apiClient";
import { RestApiError } from "@/infra/restApiError";
import type {
  ConfigListItem,
  DeleteConfigResponseBody,
  GetConfigsResponseBody,
  PatchHashActiveRequestBody,
  PatchHashActiveResponseBody,
  PostConfigRequestBody,
  PostConfigResponseBody,
  PostHashCancelResponseBody,
  PostHashRefetchResponseBody,
  PutConfigResponseBody,
} from "@/types/rest.types";

type ConfigsThunkRejectValue = {
  code: string;
  message: string;
  httpStatus: number | null;
};

type FetchConfigsListRejectValue = Pick<ConfigsThunkRejectValue, "code" | "message">;

export const fetchConfigsList = createAsyncThunk<
  ConfigListItem[],
  void,
  { rejectValue: FetchConfigsListRejectValue }
>("configs/fetchList", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<GetConfigsResponseBody>("/api/configs");
    return data.configs;
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

export const createConfig = createAsyncThunk<
  PostConfigResponseBody,
  PostConfigRequestBody,
  { rejectValue: ConfigsThunkRejectValue }
>("configs/create", async (body, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<PostConfigResponseBody>("/api/configs", body);
    return data;
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

export const deleteConfig = createAsyncThunk<
  DeleteConfigResponseBody & { hash: string },
  string,
  { rejectValue: ConfigsThunkRejectValue }
>("configs/delete", async (hash, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.delete<DeleteConfigResponseBody>(
      `/api/configs/${encodeURIComponent(hash)}`,
    );
    return { ...data, hash };
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

export const refetchConfigHash = createAsyncThunk<
  PostHashRefetchResponseBody & { hash: string },
  string,
  { rejectValue: ConfigsThunkRejectValue }
>("configs/refetchHash", async (hash, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<PostHashRefetchResponseBody>(
      `/api/hashes/${encodeURIComponent(hash)}/refetch`,
    );
    return { ...data, hash };
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

export const cancelConfigHashSync = createAsyncThunk<
  PostHashCancelResponseBody & { hash: string },
  string,
  { rejectValue: ConfigsThunkRejectValue }
>("configs/cancelHashSync", async (hash, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<PostHashCancelResponseBody>(
      `/api/hashes/${encodeURIComponent(hash)}/cancel`,
    );
    return { ...data, hash };
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

export const patchConfigHashActive = createAsyncThunk<
  PatchHashActiveResponseBody,
  { hash: string; isActive: boolean },
  { rejectValue: ConfigsThunkRejectValue }
>("configs/patchHashActive", async ({ hash, isActive }, { rejectWithValue }) => {
  try {
    const body: PatchHashActiveRequestBody = { isActive };
    const { data } = await apiClient.patch<PatchHashActiveResponseBody>(
      `/api/hashes/${encodeURIComponent(hash)}/active`,
      body,
    );
    return data;
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

type UpdateConfigFulfilledPayload = Readonly<{
  requestHash: string;
  configName: string;
  response: PutConfigResponseBody;
}>;

export const updateConfig = createAsyncThunk<
  UpdateConfigFulfilledPayload,
  { hash: string; body: PostConfigRequestBody },
  { rejectValue: ConfigsThunkRejectValue }
>("configs/update", async ({ hash, body }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put<PutConfigResponseBody>(
      `/api/configs/${encodeURIComponent(hash)}`,
      body,
    );
    return {
      requestHash: hash,
      configName: body.configName,
      response: data,
    };
  } catch (error) {
    if (error instanceof RestApiError) {
      return rejectWithValue({
        code: error.code,
        message: error.restMessage,
        httpStatus: error.httpStatus,
      });
    }
    throw error;
  }
});

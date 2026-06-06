import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/infra/apiClient";
import { RestApiError } from "@/infra/restApiError";
import type {
  GetStremioManifestUrlResponseBody,
  PostChangePasswordRequestBody,
  PostChangePasswordResponseBody,
} from "@/types/rest.types";
import type { ChangePasswordFormValues } from "@/validation/changePassword.validation";

type InstallThunkRejectValue = {
  code: string;
  message: string;
  httpStatus: number | null;
};

export const fetchStremioManifestUrl = createAsyncThunk<
  GetStremioManifestUrlResponseBody,
  void,
  { rejectValue: InstallThunkRejectValue }
>("install/fetchStremioManifestUrl", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<GetStremioManifestUrlResponseBody>(
      "/api/stremio/manifest-url",
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

export const changePassword = createAsyncThunk<
  PostChangePasswordResponseBody,
  ChangePasswordFormValues,
  { rejectValue: InstallThunkRejectValue }
>("install/changePassword", async (values, { rejectWithValue }) => {
  try {
    const body: PostChangePasswordRequestBody = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    const { data } = await apiClient.post<PostChangePasswordResponseBody>(
      "/api/auth/change-password",
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

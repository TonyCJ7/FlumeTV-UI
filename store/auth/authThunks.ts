import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/infra/apiClient";
import { RestApiError } from "@/infra/restApiError";
import type { LoginFormValues, RegisterFormValues } from "@/validation/auth.validation";
import type {
  AuthUserResponseBody,
  PostLoginRequestBody,
  PostLogoutResponseBody,
  PostRegisterRequestBody,
} from "@/types/rest.types";

type AuthThunkRejectValue = {
  code: string;
  message: string;
  httpStatus: number | null;
};

export const registerUser = createAsyncThunk<
  AuthUserResponseBody,
  RegisterFormValues,
  { rejectValue: AuthThunkRejectValue }
>("auth/register", async (values, { rejectWithValue }) => {
  try {
    const body: PostRegisterRequestBody = { password: values.password };
    const { data } = await apiClient.post<AuthUserResponseBody>("/api/auth/register", body);
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

/** Session probe on app load — `GET /api/auth/me`. */
export const bootstrapSession = createAsyncThunk<
  AuthUserResponseBody,
  void,
  { rejectValue: AuthThunkRejectValue }
>("auth/bootstrapSession", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get<AuthUserResponseBody>("/api/auth/me");
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

export const loginUser = createAsyncThunk<
  AuthUserResponseBody,
  LoginFormValues,
  { rejectValue: AuthThunkRejectValue }
>("auth/login", async (values, { rejectWithValue }) => {
  try {
    const body: PostLoginRequestBody = {
      password: values.password,
      userId: values.userId,
    };
    const { data } = await apiClient.post<AuthUserResponseBody>("/api/auth/login", body);
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

/** Clears httpOnly session cookie — `POST /api/auth/logout` (backend Step 25). */
export const logoutUser = createAsyncThunk<
  PostLogoutResponseBody,
  void,
  { rejectValue: AuthThunkRejectValue }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<PostLogoutResponseBody>("/api/auth/logout");
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

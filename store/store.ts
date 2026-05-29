import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/store/auth/authSlice";
import { configsReducer } from "@/store/configs/configsSlice";
import { installReducer } from "@/store/install/installSlice";
import { prefetchStatusReducer } from "@/store/prefetchStatus/prefetchStatusSlice";
import { uiReducer } from "@/store/ui/uiSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      configs: configsReducer,
      install: installReducer,
      prefetchStatus: prefetchStatusReducer,
      ui: uiReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

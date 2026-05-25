import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userSlice from "./slices/userSlice/slice";
import schoolsReducer from "./slices/schools/slice";
import schoolSetupReducer from "./slices/schoolSetup/slice";

const userPersistConfig = { key: "user", storage };

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  schools: schoolsReducer,
  schoolSetup: schoolSetupReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userSlice from "./slices/userSlice/slice";
import schoolsReducer from "./slices/schools/slice";
import classesReducer from "./slices/academics/classes/slice";
import curriculumsReducer from "./slices/academics/curriculums/slice";
import curriculumsSyllabusReducer from "./slices/academics/curriculums_syllabus/slice";
import questionBankReducer from "./slices/academics/question_bank/slice";
import baseAcademicsReducer from "./slices/academics/base_academics/slice";
import admissionsReducer from "./slices/admissions/slice";
const cartPersistConfig = {
  key: "cart",
  storage,
};

const wishListPersistConfig = {
  key: "wishList",
  storage,
};
const userPersistConfig = {
  key: "user",
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  schools: schoolsReducer,
  classes: classesReducer,
  curriculums: curriculumsReducer,
  curriculumsSyllabus: curriculumsSyllabusReducer,
  questionBank: questionBankReducer,
  baseAcademics: baseAcademicsReducer,
  admissions: admissionsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

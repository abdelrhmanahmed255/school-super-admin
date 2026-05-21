import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userSlice from "./slices/userSlice/slice";
import schoolsReducer from "./slices/schools/slice";
import usersReducer from "./slices/users/slice";
import dashboardReducer from "./slices/dashboard/slice";
import familiesReducer from "./slices/families/slice";
import classesReducer from "./slices/academics/classes/slice";
import curriculumsReducer from "./slices/academics/curriculums/slice";
import curriculumsSyllabusReducer from "./slices/academics/curriculums_syllabus/slice";
import questionBankReducer from "./slices/academics/question_bank/slice";
import baseAcademicsReducer from "./slices/academics/base_academics/slice";
import teachersStatisticsReducer from "./slices/teachers_statistics/slice";
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
  users: usersReducer,
  dashboard: dashboardReducer,
  families: familiesReducer,
  classes: classesReducer,
  curriculums: curriculumsReducer,
  curriculumsSyllabus: curriculumsSyllabusReducer,
  questionBank: questionBankReducer,
  baseAcademics: baseAcademicsReducer,
  teachersStatistics: teachersStatisticsReducer,
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

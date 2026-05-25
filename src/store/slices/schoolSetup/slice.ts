import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SchoolSetupState,
  FeatureFlags,
  TIER_DEFAULT_FLAGS,
  SubscriptionData,
  AdminCredentials,
  SubscriptionTier,
} from "./types";
import { saveSetupData, completeSetup, fetchSchoolSetupData } from "./thunks";

const initialState: SchoolSetupState = {
  currentStep: 1,
  schoolId: null,
  selectedSchoolName: null,
  setupData: {
    basicInfo: {
      name: "",
      code: "",
      address: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      timezone: "UTC",
    },
    subscription: {
      tier: "basic",
      billingCycle: "monthly",
      status: "active",
    },
    featureFlags: { ...TIER_DEFAULT_FLAGS.basic },
    adminCredentials: {
      name: "",
      email: "",
      temporaryPassword: "",
      credentialsSent: false,
    },
  },
  loading: false,
  saving: false,
  error: null,
  completedSteps: [],
  isSetupComplete: false,
};

const schoolSetupSlice = createSlice({
  name: "schoolSetup",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSchoolId: (state, action: PayloadAction<{ id: string; name?: string }>) => {
      state.schoolId = action.payload.id;
      if (action.payload.name) state.selectedSchoolName = action.payload.name;
    },
    setSelectedSchoolName: (state, action: PayloadAction<string>) => {
      state.selectedSchoolName = action.payload;
    },
    updateBasicInfo: (
      state,
      action: PayloadAction<Partial<SchoolSetupState["setupData"]["basicInfo"]>>,
    ) => {
      state.setupData.basicInfo = { ...state.setupData.basicInfo, ...action.payload };
    },
    updateSubscription: (state, action: PayloadAction<Partial<SubscriptionData>>) => {
      state.setupData.subscription = { ...state.setupData.subscription, ...action.payload };
      if (action.payload.tier) {
        const tier = action.payload.tier as SubscriptionTier;
        state.setupData.featureFlags = { ...TIER_DEFAULT_FLAGS[tier] };
      }
    },
    updateFeatureFlags: (state, action: PayloadAction<Partial<FeatureFlags>>) => {
      state.setupData.featureFlags = { ...state.setupData.featureFlags, ...action.payload };
    },
    updateAdminCredentials: (state, action: PayloadAction<Partial<AdminCredentials>>) => {
      state.setupData.adminCredentials = {
        ...state.setupData.adminCredentials,
        ...action.payload,
      };
    },
    addCompletedStep: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },
    setSetupComplete: (state, action: PayloadAction<boolean>) => {
      state.isSetupComplete = action.payload;
    },
    resetSetup: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolSetupData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolSetupData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const p = action.payload as Partial<SchoolSetupState["setupData"]>;
          if (p.basicInfo) state.setupData.basicInfo = { ...state.setupData.basicInfo, ...p.basicInfo };
          if (p.subscription) state.setupData.subscription = { ...state.setupData.subscription, ...p.subscription };
          if (p.featureFlags) state.setupData.featureFlags = { ...state.setupData.featureFlags, ...p.featureFlags };
          if (p.adminCredentials) state.setupData.adminCredentials = { ...state.setupData.adminCredentials, ...p.adminCredentials };
        }
      })
      .addCase(fetchSchoolSetupData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveSetupData.pending, (state) => { state.saving = true; })
      .addCase(saveSetupData.fulfilled, (state) => { state.saving = false; })
      .addCase(saveSetupData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(completeSetup.pending, (state) => { state.saving = true; })
      .addCase(completeSetup.fulfilled, (state) => { state.saving = false; state.isSetupComplete = true; })
      .addCase(completeSetup.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentStep,
  setSchoolId,
  setSelectedSchoolName,
  updateBasicInfo,
  updateSubscription,
  updateFeatureFlags,
  updateAdminCredentials,
  addCompletedStep,
  setSaving,
  setSetupComplete,
  resetSetup,
} = schoolSetupSlice.actions;

export default schoolSetupSlice.reducer;

export type SubscriptionTier = "free" | "basic" | "premium" | "enterprise";
export type BillingCycle = "monthly" | "annually";
export type SubscriptionStatus = "active" | "trial" | "pending" | "expired";

export interface SubscriptionData {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
}

export interface FeatureFlags {
  lmsModule: boolean;
  parentPortal: boolean;
  smsNotifications: boolean;
  advancedAnalytics: boolean;
  onlinePayments: boolean;
  libraryModule: boolean;
  transportModule: boolean;
  hrModule: boolean;
  inventoryModule: boolean;
  customDomain: boolean;
}

export const TIER_DEFAULT_FLAGS: Record<SubscriptionTier, FeatureFlags> = {
  free: {
    lmsModule: true,
    parentPortal: false,
    smsNotifications: false,
    advancedAnalytics: false,
    onlinePayments: false,
    libraryModule: false,
    transportModule: false,
    hrModule: false,
    inventoryModule: false,
    customDomain: false,
  },
  basic: {
    lmsModule: true,
    parentPortal: true,
    smsNotifications: false,
    advancedAnalytics: false,
    onlinePayments: true,
    libraryModule: true,
    transportModule: false,
    hrModule: false,
    inventoryModule: false,
    customDomain: false,
  },
  premium: {
    lmsModule: true,
    parentPortal: true,
    smsNotifications: true,
    advancedAnalytics: true,
    onlinePayments: true,
    libraryModule: true,
    transportModule: true,
    hrModule: true,
    inventoryModule: true,
    customDomain: false,
  },
  enterprise: {
    lmsModule: true,
    parentPortal: true,
    smsNotifications: true,
    advancedAnalytics: true,
    onlinePayments: true,
    libraryModule: true,
    transportModule: true,
    hrModule: true,
    inventoryModule: true,
    customDomain: true,
  },
};

export interface AdminCredentials {
  name: string;
  email: string;
  temporaryPassword: string;
  credentialsSent: boolean;
}

export interface SchoolSetupState {
  currentStep: number;
  schoolId: string | null;
  selectedSchoolName: string | null;
  setupData: {
    basicInfo: {
      name: string;
      code: string;
      address: string;
      city: string;
      state: string;
      country: string;
      phone: string;
      email: string;
      website: string;
      timezone: string;
    };
    subscription: SubscriptionData;
    featureFlags: FeatureFlags;
    adminCredentials: AdminCredentials;
  };
  loading: boolean;
  saving: boolean;
  error: string | null;
  completedSteps: number[];
  isSetupComplete: boolean;
}

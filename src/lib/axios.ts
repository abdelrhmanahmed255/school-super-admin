/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    let locale: string | undefined = Cookies.get("NEXT_LOCALE");

    if (!locale && typeof window !== "undefined") {
      locale = window.localStorage.getItem("locale") || "ar";
    }

    if (!locale) {
      locale = "ar";
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Accept-Language", locale);
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    } else {
      config.headers = {
        ...config.headers,
        "Accept-Language": locale,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      } as any;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

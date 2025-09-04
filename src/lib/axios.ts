import axios from "axios";
import { fa } from "zod/v4/locales";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: false,
});

export default axiosInstance;

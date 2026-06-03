import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "") });
export const safe = async (fn, fallback) => { try { return await fn(); } catch (e) { console.error(e); return fallback; } };

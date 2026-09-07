import axios from "axios";
import type { SearchAPIResponse } from "../types";

export async function searchQuery(
  query: string,
  page = 1,
  signal?: AbortSignal
): Promise<SearchAPIResponse | any[]> {
    const base = "/api"; 
  const url = `${base}/search`;
  const params = { query, page };

  const res = await axios.get(url, {
    params,
    signal,
    // timeout: 15000,
    responseType: "json",
    headers: {
      Accept: "application/json",
    },
    // validateStatus: (status) => status >= 200 && status < 400,
  });

  return res.data;
}

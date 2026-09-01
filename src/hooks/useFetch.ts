import { useEffect, useState } from "react";

interface useFetchProps<T> {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
}

const BASE_URL = "http://localhost:3000";

export function useFetch<T>(url: string): useFetchProps<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await fetch(`${BASE_URL}${url}`);
        if (!response.ok) {
          throw new Error(`Error fetching data from ${url}`);
        }
        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

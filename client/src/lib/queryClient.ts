import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || res.statusText;
    } catch (e) {
      errorMessage = await res.text() || res.statusText;
    }
    console.error(`API Error ${res.status}: ${errorMessage}`);
    throw new Error(errorMessage || `Error ${res.status}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`API Request: ${method} ${url}`, data);
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "same-origin",
    });
    
    console.log(`API Response: ${res.status} from ${url}`);
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`Query Request: ${queryKey[0]}`);
    
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "same-origin",
      });
      
      console.log(`Query Response: ${res.status} from ${queryKey[0]}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Unauthorized request, returning null as configured");
        return null;
      }
      
      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`Query data received:`, data);
      return data;
    } catch (error) {
      console.error(`Query error for ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

import useSWR, { mutate as globalMutate } from "swr";
import useSWRInfinite from "swr/infinite";
import { api } from "./api";

// Categories barely change — cache aggressively, don't refetch on every tab focus.
export function useCategories() {
  const { data, isLoading } = useSWR("categories", () => api.categories(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60_000,
  });

  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
      ? data.categories
      : [];

  return { categories, isLoading };
}

export function useProducts(params = {}) {
  const key = ["products", JSON.stringify(params)];
  const { data, isLoading, error } = useSWR(key, () => api.products(params), {
    revalidateOnFocus: false,
    keepPreviousData: true, // keep showing the old grid while the new filter's request is in flight
    dedupingInterval: 5_000,
  });

  const products = Array.isArray(data?.products)
    ? data.products.filter(Boolean)
    : [];

  return {
    products,
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
  };
}

export function useProduct(slug) {
  const { data, isLoading, error } = useSWR(slug ? ["product", slug] : null, () => api.product(slug), {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });
  return { product: data, isLoading, error };
}

// Infinite-scroll product listing. Each additional page is appended to the
// grid (not re-rendered from scratch), and every page fetched is cached by
// SWR — flipping a filter and back doesn't refetch pages you've already seen.
export function useInfiniteProducts(baseParams = {}) {
  const key = JSON.stringify(baseParams);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && pageIndex + 1 > previousPageData.totalPages) return null; // reached the end
    return ["products-infinite", key, pageIndex + 1];
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    (k) => api.products({ ...baseParams, page: k[2], limit: baseParams.limit || 12 }),
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  const pages = Array.isArray(data) ? data.filter(Boolean) : [];
  const products = pages.flatMap((page) => Array.isArray(page?.products) ? page.products.filter(Boolean) : []);
  const totalPages = pages[0]?.totalPages || 1;
  const hasMore = size < totalPages;

  return {
    products,
    isLoading: isLoading && products.length === 0,
    isLoadingMore: isValidating && products.length > 0,
    hasMore,
    loadMore: () => setSize(size + 1),
  };
}

// Shared across Profile and Checkout — whichever page loads first populates the
// cache, so the other one shows addresses instantly with zero network wait.
export function useAddresses(enabled) {
  const { data, isLoading, mutate } = useSWR(enabled ? "addresses" : null, () => api.addresses(), {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });
  return { addresses: data || [], isLoading, mutate };
}

export function useOrders(enabled) {
  const { data, isLoading, mutate } = useSWR(enabled ? "orders" : null, () => api.orders(), {
    revalidateOnFocus: false,
    dedupingInterval: 5_000,
  });
  return { orders: data || [], isLoading, mutate };
}

export function useOrder(id) {
  const { data, isLoading } = useSWR(id ? ["order", id] : null, () => api.order(id), {
    revalidateOnFocus: false,
    dedupingInterval: 5_000,
  });
  return { order: data, isLoading };
}

// Call after placing an order so the /orders list is fresh next time it's opened,
// without forcing this page to wait on a refetch right now.
export function invalidateOrders() {
  globalMutate("orders");
}


type SupabaseResponse<T> = {
  results: T[];
  error?: string;
};

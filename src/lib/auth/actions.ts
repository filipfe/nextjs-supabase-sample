"use server";

import { createClient } from "../supabase/server";

export async function signIn(
  formData: FormData
): Promise<SupabaseResponse<any>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return {
      error: "Both email and password are required!",
      results: [],
    };
  }

  // important to always init Supabase inside a server action
  // if there are multiple actions, each will need its own Supabase client

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
      results: [],
    };
  }

  return {
    results: [],
  };
}

export async function deleteUser(
  formData: FormData
): Promise<SupabaseResponse<string>> {
  const id = formData.get("id")?.toString();

  const supabase = createClient({ isAdmin: true });

  // verify if authenticated user is the one that is being deleted

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== id) {
    return {
      error: "Not authorized!",
      results: [],
    };
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results: [user.id],
  };
}

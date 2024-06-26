"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

export async function signIn(
  formData: FormData
): Promise<SupabaseResponse<any>> {
  const email = formData.get("email")?.toString();

  if (!email) {
    return {
      error: "Email is required!",
      results: [],
    };
  }

  // important to always init Supabase inside a server action
  // if there are multiple actions, each will need its own Supabase client

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
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

  const supabase = createClient();

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

  // const { error } = await supabase.auth.admin.deleteUser(user.id);
  const current = new Date();
  const deletion_date = new Date();
  deletion_date.setDate(current.getDate() + 10);
  const { error } = await supabase
    .from("profiles")
    .update({ deletion_date })
    .eq("id", user.id);

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  revalidatePath("/", "layout");

  return {
    results: [deletion_date.toLocaleDateString()],
  };
}

export async function reactivateUser(
  formData: FormData
): Promise<SupabaseResponse<string>> {
  const id = formData.get("id")?.toString();

  const supabase = createClient();

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

  const { error } = await supabase
    .from("profiles")
    .update({ deletion_date: null })
    .eq("id", user.id);

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

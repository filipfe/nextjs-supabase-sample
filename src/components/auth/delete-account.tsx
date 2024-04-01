"use client";

import { deleteUser } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteAccount({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const res = await deleteUser(formData);
          if (res?.error) {
            toast.error(res.error);
          }
        })
      }
    >
      <input type="hidden" name="id" value={userId} id="user-id" />
      <Button isLoading={isPending} color="danger" type="submit">
        Delete account
      </Button>
    </form>
  );
}

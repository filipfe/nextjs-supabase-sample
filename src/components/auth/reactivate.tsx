"use client";

import { reactivateUser } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function Reactivate({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      className="w-full"
      action={(formData) =>
        startTransition(async () => {
          const res = await reactivateUser(formData);
          if (res?.error) {
            toast.error(res.error);
          } else {
            toast.success("Your account has been reactivated!");
          }
        })
      }
    >
      <input type="hidden" name="id" value={userId} id="user-id" />
      <Button
        isLoading={isPending}
        color="warning"
        type="submit"
        className="w-full"
      >
        Reactivate account
      </Button>
    </form>
  );
}

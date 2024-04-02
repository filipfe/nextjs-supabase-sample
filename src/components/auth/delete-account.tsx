"use client";

import { deleteUser } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteAccount({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <form
      className="w-full"
      action={(formData) =>
        startTransition(async () => {
          const { results, error } = await deleteUser(formData);
          if (error) {
            toast.error(error);
          } else {
            toast.success(
              `Your account has been scheduled to be deleted on ${results[0]}!`
            );
            router.push("/reactivate");
          }
        })
      }
    >
      <input type="hidden" name="id" value={userId} id="user-id" />
      <Button
        className="w-full"
        isLoading={isPending}
        color="danger"
        type="submit"
      >
        Delete account
      </Button>
    </form>
  );
}

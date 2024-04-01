"use client";

import { signIn } from "@/lib/auth/actions";
import { Button, Input } from "@nextui-org/react";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const { error } = await signIn(formData);
          if (error) {
            toast.error(error);
          } else {
            toast.success("Your link has been sent!");
          }
        })
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="example@mail.com"
          disableAnimation
          isRequired
        />
        <Button
          className="mt-2"
          color="primary"
          disableAnimation
          disableRipple
          type="submit"
          isLoading={isPending}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

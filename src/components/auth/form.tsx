"use client";

import { signIn } from "@/lib/auth/actions";
import { Button, Input } from "@nextui-org/react";
import { useTransition } from "react";

export default function Form() {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const { error } = await signIn(formData);
        })
      }
    >
      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        placeholder="example@mail.com"
        disableAnimation
        isRequired
      />
      <Input
        label="Email"
        type="password"
        id="password"
        name="password"
        placeholder="************"
        disableAnimation
        isRequired
      />
      <Button>Submit</Button>
    </form>
  );
}

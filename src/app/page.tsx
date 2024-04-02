import DeleteAccount from "@/components/auth/delete-account";
import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export default async function Home() {
  // always init server Supabase client inside a page
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Card className="w-full max-w-sm p-4">
      <CardHeader>You are logged in!</CardHeader>
      <CardBody>Email: {user!.email}</CardBody>
      <CardFooter>
        <DeleteAccount userId={user!.id} />
      </CardFooter>
    </Card>
  );
}

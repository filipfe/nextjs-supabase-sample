import Reactivate from "@/components/auth/reactivate";
import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("deletion_date")
    .single();
  return (
    <Card className="w-full max-w-sm !p-4" shadow="none">
      <CardHeader className="text-warning">
        Your account is scheduled to be deleted!
      </CardHeader>
      <CardBody>
        <p>Email: {user!.email}</p>
        <p>Deletion date: {profile?.deletion_date}</p>
      </CardBody>
      <CardFooter>
        <Reactivate userId={user!.id} />
      </CardFooter>
    </Card>
  );
}

import Form from "@/components/auth/form";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Page() {
  return (
    <Card className="w-full max-w-sm p-4" shadow="none">
      <CardHeader className="text-xl">Sign in</CardHeader>
      <CardBody>
        <Form />
      </CardBody>
    </Card>
  );
}

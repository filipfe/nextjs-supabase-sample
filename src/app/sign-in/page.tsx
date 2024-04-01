import Form from "@/components/auth/form";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export default function Page() {
  return (
    <Card>
      <CardHeader>Sign in</CardHeader>
      <CardBody>
        <Form />
      </CardBody>
      <CardFooter />
    </Card>
  );
}

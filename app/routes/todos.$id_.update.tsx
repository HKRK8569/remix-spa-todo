import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const clientAction = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const isDone = formData.get("is-done");
  if (isDone === null) {
    return Response.json({
      errors: {
        title: "is-done is not found",
      },
    });
  }
  const isDoneBoolean = isDone === "true";
  await fetch(`http://localhost:3000/todos/${params.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      isDone: isDoneBoolean,
    }),
  });
  return redirect("/");
};

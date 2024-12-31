import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const clientAction = async ({ params }: ActionFunctionArgs) => {
  await fetch(`http://localhost:3000/todos/${params.id}`, {
    method: "DELETE",
  });
  return redirect("/");
};

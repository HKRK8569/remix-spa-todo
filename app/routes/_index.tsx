import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { Pencil, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type Todo = {
  id: number;
  title: string;
  isDone: boolean;
};

export const clientLoader = async () => {
  const response = await fetch("http://localhost:3000/todos");
  const todos: Todo[] = await response.json();
  return {
    todos,
  };
};

export const clientAction = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  if (!title) {
    return Response.json({
      errors: {
        title: "title is not found",
      },
    });
  }
  await fetch("http://localhost:3000/todos", {
    method: "POST",
    body: JSON.stringify({
      title: title,
      isDone: false,
    }),
  });
  return redirect("/");
};

export default function Index() {
  const [title, setTitle] = useState("");
  const { todos } = useLoaderData<typeof clientLoader>();
  const actionData = useActionData<typeof clientAction>();

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="flex justify-center items-center mb-4">
        <div className="w-[300px]">
          <img
            src="/logo-light.png"
            alt="Remix"
            className="block w-full dark:hidden"
          />
        </div>
      </div>
      <Form
        onSubmit={() => {
          setTitle("");
        }}
        method="POST"
        className="flex gap-x-2"
      >
        <Input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          name="title"
        />
        <Button type="submit">追加</Button>
      </Form>
      {actionData?.errors?.title && (
        <p className="text-red-500">タイトルを入力してください</p>
      )}
      <hr className=" border-t border-gray-300 my-4" />
      {todos.map((todo) => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
    </div>
  );
}

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const startEdit = () => {
    setEdit(true);
  };
  const endEdit = () => {
    setEdit(false);
  };
  return isEdit ? (
    <div key={todo.id} className="flex mb-4 justify-between p-2 bg-gray-100">
      <div className="flex items-center mr-2 flex-grow">
        <FormCheckbox id={todo.id} isDone={todo.isDone} />
        <Input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
        />
      </div>
      <div className="flex items-center w-16">
        <Form
          onSubmit={endEdit}
          action={`/todos/${todo.id}/update`}
          method="POST"
        >
          <button value={title} name="title" type="submit">
            <Pencil className="mr-4 hover:opacity-50" />
          </button>
        </Form>
        <Form
          method="POST"
          className="flex items-center"
          action={`/todos/${todo.id}/destroy`}
        >
          <button type="submit">
            <Trash className="hover:opacity-50" />
          </button>
        </Form>
      </div>
    </div>
  ) : (
    <div key={todo.id} className="flex mb-4 justify-between p-2 bg-gray-100">
      <div className="flex items-center mr-2 flex-grow">
        <FormCheckbox id={todo.id} isDone={todo.isDone} />
        <p className="h-10 flex items-center">{title}</p>
      </div>
      <div className="flex items-center w-16">
        <Pencil onClick={startEdit} className="mr-4 hover:opacity-50" />
        <Form
          method="POST"
          className="flex items-center"
          action={`/todos/${todo.id}/destroy`}
        >
          <button type="submit">
            <Trash className="hover:opacity-50" />
          </button>
        </Form>
      </div>
    </div>
  );
};

type FormCheckboxProps = {
  id: number;
  isDone: boolean;
};

const FormCheckbox = ({ id, isDone }: FormCheckboxProps) => {
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <Form action={`/todos/${id}/update`} method="POST">
      <Checkbox
        onClick={() => {
          if (submitRef.current) {
            submitRef.current.click();
          }
        }}
        checked={isDone}
        className="mr-2"
      />
      <button
        ref={submitRef}
        value={isDone ? "false" : "true"}
        name="is-done"
        type="submit"
      />
    </Form>
  );
};

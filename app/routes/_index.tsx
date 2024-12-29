import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
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

export default function Index() {
  const { todos } = useLoaderData<typeof clientLoader>();

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
      <form className="flex gap-x-2">
        <Input />
        <Button>追加</Button>
      </form>
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
    <form key={todo.id} className="flex mb-4 justify-between p-2 bg-gray-100">
      <div className="flex items-center mr-2 flex-grow">
        <Checkbox checked={todo.isDone} className="mr-2" />
        <Input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
        />
      </div>
      <div className="flex items-center w-16">
        <Pencil onClick={endEdit} className="mr-4 hover:opacity-50" />
        <Trash className="hover:opacity-50" />
      </div>
    </form>
  ) : (
    <div key={todo.id} className="flex mb-4 justify-between p-2 bg-gray-100">
      <div className="flex items-center mr-2 flex-grow">
        <Checkbox checked={todo.isDone} className="mr-2" />
        <p className="h-10 flex items-center">{title}</p>
      </div>
      <div className="flex items-center w-16">
        <Pencil onClick={startEdit} className="mr-4 hover:opacity-50" />
        <Trash className="hover:opacity-50" />
      </div>
    </div>
  );
};

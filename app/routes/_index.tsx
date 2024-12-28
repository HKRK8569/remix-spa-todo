import type { MetaFunction } from "@remix-run/node";
import { Pencil, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const TODOS = [
  {
    id: 1,
    name: "テスト1",
    isChecked: true,
  },
  {
    id: 2,
    name: "テスト2",
    isChecked: false,
  },
];

export default function Index() {
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
      {TODOS.map((todo) => {
        return (
          <div
            key={todo.id}
            className="flex mb-4 justify-between p-2 bg-gray-100"
          >
            <div className="flex items-center flex-grow">
              <Checkbox checked={todo.isChecked} className="mr-2" />
              <p>{todo.name}</p>
            </div>
            <div className="flex w-16">
              <Pencil className="mr-4 hover:opacity-50" />
              <Trash className="hover:opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

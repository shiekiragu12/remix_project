import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { User, addUser, findUserByEmailPassword } from "users";
import { v4 as uuidv4 } from "uuid";

type ActionData = {
  error?: string;
  user?: User;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  const existingUser = findUserByEmailPassword(email, password);

  const user = existingUser || newUser;

  if (!existingUser) {
    addUser(user);
  }

  return Response.json({ user }, { status: 200 });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userLogged");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      location.pathname = `/profile/${user.id}`;
    }

    if (actionData?.user) {
      localStorage.setItem("userLogged", JSON.stringify(actionData.user));
      navigate(`/profile/${actionData.user.id}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
        <h1 className="font-bold text-2xl text-center text-gray-800">Login</h1>
        <Form method="post" className="space-y-6 mt-6">
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 text-sm"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block border-gray-300 shadow-sm mt-2 px-4 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block border-gray-300 shadow-sm mt-2 px-4 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="block border-gray-300 shadow-sm mt-2 px-4 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-full font-bold text-white"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
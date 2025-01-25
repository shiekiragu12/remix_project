import { Form, redirect, useLoaderData } from "@remix-run/react";
import { User, deleteUser, findUser } from "user";

export const loader = async ({ params }: { params: { id: string } }) => {
  const user = findUser(params.id);
  if (!user) {
    return redirect("/");
  }

  return new Response(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  });
};

export const action = async ({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) => {
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "logout") {
    return redirect("/");
  }

  if (actionType === "delete") {
    deleteUser(params.id);
    return redirect("/");
  }
};

const Profile = () => {
  const user = useLoaderData<User>();

  const handleClientSideLogout = (action: string) => {
    if (action === "logout" || action === "delete") {
      localStorage.removeItem("userLogged");
    }
  };
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
        <h1 className="font-bold text-2xl text-gray-800">
          Welcome, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600">Email: {user.email}</p>
        <div className="flex space-x-4 mt-6">
          <Form method="post" onSubmit={() => handleClientSideLogout("logout")}>
            <input type="hidden" name="action" value="logout" />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-full font-bold text-white"
            >
              Logout
            </button>
          </Form>

          <Form method="post" onSubmit={() => handleClientSideLogout("delete")}>
            <input type="hidden" name="action" value="delete" />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full font-bold text-white"
            >
              Delete Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
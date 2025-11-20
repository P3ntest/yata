import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePbCollection } from "use-pocketbase";

export function AuthPage() {
  const users = usePbCollection("users");

  const [page, setPage] = useState<"login" | "register">("login");

  return (
    <div>
      <div className="join">
        <button
          className={twMerge("join-item btn", page === "login" && "btn-active")}
          onClick={() => setPage("login")}
        >
          Login
        </button>
        <button
          className={twMerge(
            "join-item btn",
            page === "register" && "btn-active"
          )}
          onClick={() => setPage("register")}
        >
          Register
        </button>
      </div>

      <h1 className="text-3xl font-bold my-4">
        {page === "login" ? "Login" : "Register"}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const username = formData.get("username") as string;
          const password = formData.get("password") as string;

          if (page === "login") {
            users.authWithPassword(username, password);
          } else {
            users
              .create({
                username,
                password,
                passwordConfirm: password,
              })
              .then(() => {
                users.authWithPassword(username, password);
              });
          }
        }}
      >
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="input"
          required
        />
        <button type="submit" className="btn btn-primary">
          {page === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

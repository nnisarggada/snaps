import { useState } from "react";
import pb from "@utils/pocketbase";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await pb
        .collection("users")
        .authWithPassword(username, password);
      if (data) {
        window.location.href = "/";
      }
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      const data = await pb.collection("users").authWithOAuth2({
        provider: "google",
        createData: {
          emailVisibility: true,
        },
      });
      if (data) {
        try {
          if (data.meta?.name && pb.authStore.model?.name == "") {
            await pb.collection("users").update(data.record.id, {
              name: data.meta.name,
            });
          }
          if (data.meta?.avatarUrl && pb.authStore.model?.avatar == "") {
            try {
              const image = await fetch(data.meta.avatarUrl).then((res) =>
                res.blob(),
              );
              await pb.collection("users").update(data.record.id, {
                avatar: image,
              });
            } catch (err) {
              console.log(err);
            }
          }
        } catch (err) {
          console.log(err);
        }
        window.location.href = "/";
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-neutral-900 rounded-md flex flex-col items-center justify-center gap-8 p-4 py-8"
    >
      <h1 className="text-2xl font-bold w-full">
        Login to{" "}
        <a
          href="/"
          className="text-purple-500 transition-all duration-500 ease-in-out hover:tracking-wider"
        >
          SNAPS
        </a>
      </h1>
      <div className="w-full flex flex-col gap-2 text-sm">
        <input
          type="text"
          className="w-full bg-neutral-800 p-3 rounded-md"
          placeholder="Email or Username*"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="w-full flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-neutral-800 p-3 rounded-md"
            placeholder="Password*"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="size-12 text-xl bg-neutral-800 grid place-items-center rounded-md p-2 transition-all duration-500 ease-in-out hover:bg-neutral-700"
          >
            {showPassword && <FaEye />}
            {!showPassword && <FaEyeSlash />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full h-14 grid place-items-center bg-purple-500 text-xl font-bold p-3 rounded-md mt-2 uppercase transition-all duration-500 ease-in-out hover:scale-105 hover:drop-shadow-xl"
        >
          {!loading && "Login"}
          {loading && <div className="loader-white"></div>}
        </button>
      </div>
      <div className="relative w-full h-2 bg-neutral-800 rounded-md">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit bg-neutral-900 text-xl px-4 rounded-full">
          OR
        </span>
      </div>
      <button
        onClick={handleGoogle}
        type="button"
        className="w-full bg-white text-black flex items-center justify-center gap-3 text-xl font-bold p-3 rounded-md transition-all duration-500 ease-in-out hover:scale-105 hover:drop-shadow-xl"
      >
        <FaGoogle />
        Continue with Google
      </button>

      <p className="text-sm">
        Don't have an account?{" "}
        <a href="/signup" className="text-purple-400 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}

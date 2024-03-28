import { useState } from "react";
import pb from "@utils/pocketbase";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    if (username.length < 3 || username.length > 150) {
      alert("Username must be between 3 and 150 characters long");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert("Username can only contain letters, numbers, and underscores");
      return false;
    }
    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && email) {
      alert("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    try {
      const data = await pb
        .collection("users")
        .getFirstListItem("email = '" + email + "'");
      if (data && email) {
        alert("Email already exists");
        return false;
      }
    } catch (err) {}

    try {
      const data = await pb
        .collection("users")
        .getFirstListItem("username = '" + username + "'");
      if (data) {
        alert("Username already exists");
        return false;
      }
    } catch (err) {}

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!(await validate())) {
      setLoading(false);
      return;
    }

    try {
      const data = await pb.collection("users").create({
        name: name,
        username: username,
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
        emailVisibility: true,
      });
      if (data) {
        try {
          await pb.collection("users").authWithPassword(username, password);
        } catch (err) {
          alert(err.message);
        }
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
          if (data.meta?.name) {
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
      onSubmit={handleSignUp}
      className="w-full max-w-md bg-neutral-900 rounded-md flex flex-col items-center justify-center gap-8 p-4 py-8"
    >
      <h1 className="text-2xl font-bold w-full">
        Welcome to{" "}
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
          placeholder="Name*"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="w-full bg-neutral-800 p-3 rounded-md"
          placeholder="Username*"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full bg-neutral-800 p-3 rounded-md"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="password"
          className="w-full bg-neutral-800 p-3 rounded-md"
          placeholder="Confirm Password*"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full h-14 grid place-items-center bg-purple-500 text-xl font-bold p-3 rounded-md mt-2 transition-all duration-500 ease-in-out hover:scale-105 hover:drop-shadow-xl"
        >
          {loading ? <div className="loader-white"></div> : "Create Account"}
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
        Already have an account?{" "}
        <a href="/login" className="text-purple-400 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

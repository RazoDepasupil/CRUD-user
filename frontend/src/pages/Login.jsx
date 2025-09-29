import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("All fields are required");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response:", data)
      setUsername("");
      setPassword("");
      setMessage("Login Successfully!");
      setTimeout(() => {
        navigate("/Dashboard");
      }, 500);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Login Failed: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="relative shadow-2xl shadow-[#9985f3] flex flex-col justify-center items-center border-2 border-white p-8 w-96 rounded-xl bg-linear-to-br from-[#9985f3] to-[#e2d3ef] min-h-105">
      <h1 className="font-bold text-2xl text-center p-2 text-white">Login</h1>

      {message && (
        <p
          className={`font-semibold mb-3 text-center ${
            message.includes("Successfully") ? "text-green-300" : "text-red-300"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-2 w-full max-w-sm"
      >
        <label className="text-white font-medium">Username:</label>
        <input
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="border-1 border-white w-full h-11 rounded-sm p-2 focus:outline-none focus:border-gray-300"
        />

        <label className="text-white font-medium">Password:</label>
        <input
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border-1 border-white w-full h-11 rounded-sm p-2 focus:outline-none focus:border-gray-300 focus:color-black"
        />

        <button
          className="hover:text-white bg-[#c7b7fc] cursor-pointer hover:bg-[#9985f3] border-2 border-[#e2d3ef] text-gray-800 font-semibold w-32 h-11 rounded-sm self-center mt-4 transition-colors active:bg-gray-200"
          type="submit"
        >
          Submit
        </button>
      </form>
      <p className="align-center mt-[10px] absolute left-15 top-90">
        Don't have an account?{" "}
        <Link
          to="/Register"
          className="absolute underline decoration-blue-500 hover:text-red-300  w-25 left-42"
        >
          {" "}
          Register here{" "}
        </Link>
      </p>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !password.trim()) {
      setMessage("All fields are required");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response:", data);

      setName("");
      setUsername("");
      setPassword("");
      setMessage("Registered Successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/")
      }, 1500);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Registration Failed: " + error.message);
      setTimeout(() => setMessage(""), 1500);
    }
  };

  return (
    <div className="shadow-2xl shadow-[#9985f3] flex flex-col justify-center items-center border-2 border-white p-8 w-96 rounded-xl bg-linear-to-br from-[#9985f3] to-[#e2d3ef] min-h-96">
      <h1 className="font-bold text-2xl text-center p-2 text-white">
        Register
      </h1>

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
        <label className="text-white font-medium">Name:</label>
        <input
          placeholder="Enter a Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="border-1 border-white w-full h-11 rounded-sm p-2 focus:outline-none focus:border-[#c7b7fc]"
        />

        <label className="text-white font-medium">Username:</label>
        <input
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="border-1 border-white w-full h-11 rounded-sm p-2 focus:outline-none focus:border-[#c7b7fc]"
        />

        <label className="text-white font-medium">Password:</label>
        <input
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border-1 border-white w-full h-11 rounded-sm p-2 focus:outline-none focus:border-[#c7b7fc] "
        />

        <button
          className="bg-[#c7b7fc] cursor-pointer hover:bg-[#9985f3] border-2 border-[#e2d3ef] text-gray-800 font-semibold w-32 h-11 rounded-sm self-center mt-4 transition-colors duration-200 active:bg-gray-200"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;

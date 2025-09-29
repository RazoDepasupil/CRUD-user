import { useState } from "react";

const Logout = () => {
  const [message, setMessage] = useState("");

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      setMessage("Logout Successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Logout Failed", error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Logout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Users from "./components/Users";

const UserDashboard = () => {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/users", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        // If unauthorized, redirect to login
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.users || data.users.length === 0) throw new Error("No Users");

      setUsers(data.users);
      if (data.currentUserId) {
        setCurrentUserId(data.currentUserId); // ✅ fixed
      }

      setMessage("Users Available");
    } catch (error) {
      setUsers([]);
      setMessage("Empty Users");
      console.error(error);
    } finally {
      setTimeout(() => setMessage(""), 1000 * 12);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Logging out...");
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const deleteBtn = async (userId) => {
    const isDeletingSelf = userId === currentUserId;

    if (isDeletingSelf) {
      const confirmDelete = window.confirm(
        "You are about to delete your own account. You will be logged out. Are you sure?"
      );
      if (!confirmDelete) return;
    }

    try {
      const res = await fetch(`http://localhost:8000/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      // If user deleted their own account
      if (isDeletingSelf || data.selfDelete) {
        setMessage("Account deleted. Logging out...");

        // No need to call logout - session already destroyed by DELETE endpoint
        // Redirect to login after a brief delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // User deleted someone else's account
        setMessage("Successfully Deleted!");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        setTimeout(() => setMessage(""), 1000 * 3);
      }
    } catch (error) {
      setMessage("Failed to delete user");
      console.error(error);
      setTimeout(() => setMessage(""), 1000 * 3);
    }
  };

  return (
    <div className="font-segoe border-none h-[100vh] w-[100%] relative">
      <div className="flex justify-between items-center absolute left-6 right-6 top-6">
        <h2 className="text-2xl font-bold">User Dashboard</h2>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>

      <div className="absolute left-165 top-5">
        {message && (
          <p className="text-lg font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
            {message}
          </p>
        )}
      </div>

      {users.length > 0 ? (
        <ul className="grid grid-cols-5 gap-2 border-none mt-20 ml-6 mr-6 p-3">
          {users.map((user) => (
            <Users
              name={user.name}
              username={user.username}
              userId={user._id}
              onDelete={deleteBtn}
              key={user._id}
              isCurrentUser={user._id === currentUserId}
            />
          ))}
        </ul>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">No Users Found</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

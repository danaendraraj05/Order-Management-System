import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { token } = useAuth();
  const [catImg, setCatImg] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsername(data.username);
      } catch {
        navigate("/login");
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_CAT_API}/cat?json=true`);
        const data = await res.json();
        setCatImg(`${import.meta.env.VITE_CAT_API}/cat/${data.id}`);
      } catch {
        setCatImg("https://placekitten.com/400/300");
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <h1 className="text-3xl mb-4">🎉 Welcome, {username}! 🎉</h1>
      {catImg && <img src={catImg} alt="Cat Celebration" className="rounded shadow-md w-80 h-80" />}
    </div>
  );
};

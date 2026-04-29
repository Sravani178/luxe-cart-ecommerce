import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save user + token
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Successful ✅");

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed ❌"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
          Welcome Back ✨
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold text-lg"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
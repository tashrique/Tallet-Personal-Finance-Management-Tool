"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message || "Login failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen flex items-center justify-center">
      <div className="hero-content w-full max-w-4xl flex-col lg:flex-row-reverse  rounded-lg">
        {/* Login */}
        <div className="card bg-base-100 w-full lg:w-2/3 shadow-2xl p-2 rounded-lg">
          <form className="card-body space-y-6" onSubmit={handleLogin}>
            <h1 className="text-4xl font-bold text-center text-white">Login</h1>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input type="email" placeholder="Enter your email" className="input input-bordered input-lg" required onChange={(e) => setLoginEmail(e.target.value)} />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Password</span>
              </label>
              <input type="password" placeholder="Enter your password" className="input input-bordered input-lg" required onChange={(e) => setLoginPassword(e.target.value)} />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary btn-lg w-full">Log In</button>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <p className="text-center text-white">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

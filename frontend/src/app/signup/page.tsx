"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/auth/register", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      if (res.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen flex items-center justify-center">
      <div className="hero-content w-full max-w-4xl flex-col lg:flex-row-reverse rounded-lg">
        {/* Signup Form */}
        <div className="card bg-base-100 w-full lg:w-2/3 shadow-2xl p-2 rounded-lg">
          <form className="card-body space-y-6" onSubmit={handleSignup}>
            <h1 className="text-4xl font-bold text-center ">Sign Up</h1>

            <div className="form-control">
              <label className="label">
                <span className="label-text ">Name</span>
              </label>
              <input type="text" placeholder="Enter your name" className="input input-bordered input-lg" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Enter your email" className="input input-bordered input-lg" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text ">Password</span>
              </label>
              <input type="password" placeholder="Enter your password" className="input input-bordered input-lg" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary btn-lg w-full">Sign Up</button>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}
            <p className="text-center ">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

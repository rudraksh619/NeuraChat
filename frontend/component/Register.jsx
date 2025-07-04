import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../src/context/Usercontext";
import axios from "../src/config/axios.js";
import { motion } from "framer-motion";
import GlowingCursor from "./GlowingCursor.jsx"; // assuming same path

const Register = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { setUser } = useContext(UserContext);

  function handleregestration(e) {
    e.preventDefault();
    axios.post('/users/register', { email, password })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate('/');
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <>
      <GlowingCursor />
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
        {/* Animated Glow Behind Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          className="absolute w-[400px] h-[500px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-400 opacity-50 blur-3xl rounded-3xl animate-softPulse"
        />

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-8 rounded-3xl text-white"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
          <form onSubmit={handleregestration} className="space-y-4">
            <input
              onChange={(e) => setemail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl 
                        bg-gradient-to-r from-pink-500 to-purple-600 
                        hover:from-purple-600 hover:to-blue-500 
                        shadow-md hover:shadow-xl transition-all duration-300 
                        text-white font-semibold tracking-wide"
            >
              Register
            </button>
          </form>
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-400 hover:text-blue-400 transition duration-300 underline underline-offset-4 hover:scale-105 inline-block"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;

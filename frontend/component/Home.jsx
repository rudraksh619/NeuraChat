import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../src/context/Usercontext";
import axios from "../src/config/axios.js";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [ismodalopen, setmodalopen] = useState(false);
  const [projectname, setprojectname] = useState("");
  const [project, setproject] = useState([]);
  const navigate = useNavigate();

  const creteProject = (e) => {
    e.preventDefault();
    axios
      .post("/projects/create", { name: projectname })
      .then((res) => {
        setmodalopen(false);
        setprojectname("");
        setproject((prev) => [...prev, res.data.project]); // update UI
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("/projects/getall")
      .then((res) => {
        setproject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="p-8 bg-black min-h-screen text-white relative">
      {/* Animated Glow Background */}
      {/* 🌌 Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Blob 1 */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-30 top-[-100px] left-[-100px]"
          animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Blob 2 */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-500 via-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px]"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Twinkling Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.3,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Grid Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)]
  bg-[length:40px_40px]"
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px", "0px 0px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl font-bold"
          >
            Your Projects
          </motion.h1>

          <motion.button
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setmodalopen(true)}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-xl transition duration-300"
          >
            + New Project
          </motion.button>
        </div>

        {/* Project Cards */}
        <motion.div
          className="flex flex-wrap gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {project.map((item) => (
            <motion.div
              key={item._id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() =>
                navigate("/project", {
                  state: { item },
                })
              }
              className="group relative w-60 cursor-pointer rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-md transition"
            >
              {/* Glowing border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_4px_rgba(34,211,238,0.4)] transition-all duration-300 z-0" />

              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <div className="text-sm text-gray-200 flex items-center gap-2">
                  <i className="ri-user-line"></i>
                  Contributors: {item.users.length}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated Modal */}
      <AnimatePresence>
        {ismodalopen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl w-full max-w-md text-white shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Create Project</h2>
              <form onSubmit={creteProject}>
                <label className="block mb-2 text-sm">Project Name</label>
                <input
                  onChange={(e) => setprojectname(e.target.value)}
                  value={projectname}
                  type="text"
                  placeholder="e.g. AI Chatbot"
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setmodalopen(false)}
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 transition text-white"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;

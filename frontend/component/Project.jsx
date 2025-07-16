import React, { useEffect } from "react";
import { UserContext } from "../src/context/Usercontext.jsx";
import { useState } from "react";
import axios from "../src/config/axios.js";
import { data, useLocation } from "react-router-dom";
import { creating_socket, receiveMessage, sendMessage } from "../src/socket.js";
import { useContext } from "react";
import Markdown from "markdown-to-jsx";
import { useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { motion } from "framer-motion";
import { getwebcontainer } from "../src/config/webcontainer";

const Project = () => {
  const location = useLocation();
  const [is_slide_bar_open, set_slide_bar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, SetSelectedUser] = useState([]);
  const [alluser, setUsers] = useState([]);
  const [project, setproject] = useState(location.state.item);
  const [message, setmessage] = useState("");
  const { user } = useContext(UserContext);
  const [selectedfile, setselectedfile] = useState(null);
  const [receiveMessSage, setreceiveMessage] = useState([]);
  const [openfile, setopenfile] = useState([]);
  const [fileTree, setfileTree] = useState({});
  const [runProcess, setrunProcess] = useState(null);
  const [webContainer, setwebContainer] = useState(null);
  const [iframeurl, setiframeurl] = useState(null);

  useEffect(() => {
    axios
      .get(`/projects/get_project/${location.state.item._id}`)
      .then((res) => {
        setproject(res.data.project);
        setfileTree(res.data.project.fileTree || {});
      })
      .catch((err) => console.log(err));

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.all_user))
      .catch((err) => console.log(err));
  }, []);

  // 2. When project._id becomes available, create socket and listener
  useEffect(() => {
    if (project && project._id) {
      // Wait until the correct project is set
      console.log(
        "✅ Now creating socket with correct project id",
        project._id
      );
      const socket = creating_socket(project._id);

      const handler = (data) => {
        try {
          console.log("Raw socket data:", data);

          if (data.sender._id == "ai") {
            const message = JSON.parse(data.message);
            console.log("ai paresed message", message);
            if (webContainer) {
              webContainer.mount(message.fileTree);
            }

            if (message.fileTree) {
              setfileTree(message.fileTree);
            }

            setreceiveMessage((prev) => [...prev, data]);
          } else {
            setreceiveMessage((prev) => [...prev, data]);
          }
        } catch (err) {
          console.log("❌ handler error:", err.message);
          console.log("Offending data:", data);
        }
      };

      receiveMessage("project-message", handler);

      return () => {
        // only removes this handler
        socket.off("project-message", handler); // clean old listener
      };
    }
  }, [project]);

  function addUser() {
    const project = axios
      .put("/projects/add-user", {
        project_id: location.state.item._id,
        users: selectedUser,
      })
      .then((res) => {
        setIsModalOpen(false);
        SetSelectedUser([]);
      })
      .catch((err) => {
        console.log("having error");
        console.log(err);
      });
  }

  function send() {
    console.log(user);
    const senddata = {
      message,
      sender: user,
    };
    sendMessage("project-message", senddata);
    setmessage("");
    appendoutgoingmessage();
  }
  const messagebox = useRef(null);
  useEffect(() => {
    scrolltobottom();
  }, [receiveMessSage]);

  function appendoutgoingmessage() {
    const messagediv = document.querySelector(".message-section");
    const new_div = document.createElement("div");
    new_div.classList.add(
      "message",
      "relative",
      "bg-gray-800", // Dark background
      "text-gray-100", // Light text
      "rounded-md",
      "p-2",
      "m-1",
      "max-w-64",
      "ml-auto", // Right-align user msg
      "flex",
      "flex-col",
      "gap-1",
      "shadow-lg", // Glow/depth
      "message-animate-in", // Animation
      "border", // Required for border
      "border-transparent",
      "bg-clip-padding",
      "before:absolute",
      "before:inset-0",
      "before:rounded-md",
      "before:p-[2px]",
      "before:bg-gradient-to-br", // Gradient border effect
      "before:from-cyan-500",
      "before:to-blue-600",
      "before:content-['']",
      "before:z-[-1]"
    );

    if (message.length != 0) {
      new_div.innerHTML = `
   <small className='opacity-65 text-xs'>${user.email}</small>
      <p className='text-[0.9rem]'>${message}</p>
  `;
    }

    messagediv.appendChild(new_div);
    scrolltobottom();
  }

  function scrolltobottom() {
    messagebox.current.scrollTop = messagebox.current.scrollHeight;
  }

  function appendAiMessage(message) {
    const messageobject = JSON.parse(message);
    return (
      <div className="p-2 rounded-2xl overflow-auto max-w-96 text-white bg-black ">
        <Markdown children={messageobject.text} />
      </div>
    );
  }

  useEffect(() => {
    console.log("crossOriginIsolated:", window.crossOriginIsolated);
    if (webContainer === null) {
      getwebcontainer()
        .then((container) => {
          setwebContainer(container);
          console.log("✅ WebContainer created and stored in ref ", container);
        })
        .catch((err) => {
          console.error("❌ Failed to get WebContainer:", err);
        });
    }
  }, []);

  function getLanguage(filename) {
    if (!filename) return "text"; // ✅ handle null or undefined filename

    const ext = filename.split(".").pop();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "json":
        return "json";
      case "py":
        return "python";
      case "html":
        return "html";
      case "css":
        return "css";
      case "java":
        return "java";
      case "c":
      case "cpp":
        return "cpp";
      default:
        return "text";
    }
  }

  function saved_fileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        project_id: project._id,
        fileTree: ft,
      })
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
      });
  }
  console.log("project data ", project);

  console.log("length of receive message ", receiveMessSage);

  return (
    <main className="h-screen w-screen flex  bg-black">
      <section className="left_Section relative flex flex-col h-screen w-96  bg-slate-300">
        <header
          className="w-96 z-50 px-4 py-3 flex justify-between items-center fixed top-0
  backdrop-blur-lg bg-gradient-to-r from-[#0f0f0f]/70 to-[#1a1a1a]/70
  border-b border-white/10 shadow-[0_0_20px_rgba(0,255,255,0.1)]"
        >
          {/* Left: Add User */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="bg-[#111111]/60 hover:bg-[#1f1f1f] text-cyan-400 rounded-full h-10 w-10 flex justify-center items-center shadow-md border border-cyan-400/20"
          >
            <i className="ri-user-add-fill text-lg"></i>
          </motion.button>

          {/* Center: Glowing App Name */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-cyan-300 text-lg md:text-xl font-bold tracking-wide drop-shadow-[0_0_10px_#00ffff]
    animate-pulse"
          >
            {project?.name}
          </motion.h1>

          {/* Right: Sidebar & Theme toggle */}
          <div className="flex gap-2 items-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => set_slide_bar(!is_slide_bar_open)}
              className="bg-[#111111]/60 hover:bg-[#1f1f1f] text-cyan-400 rounded-full h-10 w-10 flex justify-center items-center shadow-md border border-cyan-400/20"
            >
              <i className="ri-group-fill text-lg"></i>
            </motion.button>
          </div>
        </header>

        <div className="conversational-area  pt-16 pb-16  relative flex flex-col flex-grow h-full ">
          <div
            ref={messagebox}
            className="message-section  flex flex-grow flex-col gap-3 max-h-full overflow-auto "
          >
            {receiveMessSage.map((mssg, indx) => {
              return (
                <div
                  className={`message relative bg-gray-800 text-gray-100 rounded-md p-2 m-1 max-w-64 mr-auto flex flex-col gap-1 shadow-lg message-animate-in border border-transparent bg-clip-padding before:absolute before:inset-0 before:rounded-md before:p-[2px] before:bg-gradient-to-br before:from-cyan-500 before:to-blue-600 before:content-[''] before:z-[-1] ${
                    mssg.sender?.email === "AI" ? "max-w-96" : "max-w-64"
                  }`}
                >
                  <small className="opacity-65 text-xs">
                    {mssg.sender?.email}
                  </small>

                  {mssg.sender._id === "ai" ? (
                    appendAiMessage(mssg.message)
                  ) : (
                    <p className="text-[0.9rem]">{mssg.message}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="input-section w-full flex justify-center items-center absolute bottom-0 px-2 py-2 rounded-2xl bg-black/30 backdrop-blur-lg border-t border-white/10 z-50">
            <div className="flex w-full max-w-lg items-center bg-gradient-to-br from-[#0f0f0f]/50 to-[#1a1a1a]/60 border border-cyan-400/20 backdrop-blur-md rounded-full shadow-[0_0_12px_rgba(0,255,255,0.15)] px-3 py-1.5">
              {/* Input */}
              <input
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                type="text"
                placeholder="Message..."
                className="flex-grow bg-transparent text-white placeholder:text-gray-400 px-3 py-1.5 text-md focus:outline-none"
              />

              {/* Send Button */}
              <button
                onClick={send}
                disabled={message.length == 0}
                className={
                  "ml-2 h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_8px_rgba(0,255,255,0.3)] hover:shadow-[0_0_12px_rgba(0,255,255,0.5)] transition-all duration-200"
                }
              >
                <i className="ri-send-plane-fill text-white text-base"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          onClick={() => set_slide_bar(!is_slide_bar_open)}
          className={`side_bar flex flex-col gap-2  h-full w-full bg-white transition-all absolute -left-96 ${
            is_slide_bar_open ? "translate-x-96 top-0" : ""
          }`}
        >
          <header className="flex justify-end p-3 bg-slate-300 shadow-2xl">
            <button
              onClick={() => {
                set_slide_bar(!is_slide_bar_open);
              }}
              className="cursor-pointer"
            >
              <i className="ri-close-fill "></i>
            </button>
          </header>

          <div className="users h-full flex flex-col p-4 overflow-scroll scroll-auto">
            {project.users &&
              project.users.map((user) => {
                return (
                  <div className="flex hover:bg-slate-300 m-2 justify-start gap-3 items-center p-3 min-w-fit rounded-xl bg-slate-200 shadow-emerald-50">
                    <div className="h-[2rem] w-[2rem] bg-gray-600 flex justify-center items-center  rounded-full p-5 text-white ">
                      <i className="ri-user-fill"></i>
                    </div>
                    <span className="text-lg font-bold">{user.email}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <section className="right_section bg-red-100 h-full flex flex-grow">
        <div className="explorer bg-slate-200  h-full min-w-52 max-w-64">
          {fileTree &&
            typeof fileTree === "object" &&
            Object.keys(fileTree).map((filename, indx) => {
              return (
                <div className="file_tree w-full flex flex-col p-2 my-2">
                  <button
                    onClick={() => {
                      console.log("you just clicked");
                      setselectedfile(filename);

                      if (!openfile.includes(filename)) {
                        setopenfile([...openfile, filename]);
                      }
                    }}
                    className=" file_tiles rounded-md bg-slate-400 p-2 w-full"
                  >
                    <p className="font-bold w-full  cursor-pointer ">
                      {filename}
                    </p>
                  </button>
                </div>
              );
            })}
        </div>

        <div className="code_editor h-full flex flex-col flex-grow shadow-2xl bg-slate-200">
          <div className="top flex justify-between w-full  gap-2">
            <div className="files flex ">
              {openfile.map((file, indx) => (
                <button
                  key={indx}
                  onClick={() => setselectedfile(file)}
                  className={`font-bold p-2 shadow-2xl w-fit ${
                    file === selectedfile ? "bg-slate-300" : ""
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            <div className="action flex gap-2">
              <button
                onClick={async () => {
                  await webContainer?.mount(fileTree);

                  const installprocess = await webContainer.spawn("npm", [
                    "install",
                  ]);
                  installprocess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  if (runProcess) {
                    runProcess.kill();
                  }

                  let startProcess = await webContainer.spawn("npm", ["start"]);
                  startProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  setrunProcess(startProcess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setiframeurl(url);
                  });
                }}
                className="p-2 w-fit bg-fuchsia-400 shadow-2xl"
              >
                Run
              </button>
            </div>
          </div>

          <CodeEditor
            value={fileTree[selectedfile]?.file.contents}
            language={getLanguage(selectedfile)}
            placeholder="Please enter code."
            onChange={(e) => {
              const updatedContent = e.target.value;
              const ft = {
                ...fileTree,
                [selectedfile]: {
                  file: {
                    contents: updatedContent,
                  },
                },
              };
              setfileTree(ft);
              saved_fileTree(ft);
            }}
            padding={15}
            style={{
              backgroundColor: "#1e1e1e",
              fontFamily: "monospace",
              color: "white",
              fontSize: 14,
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        {iframeurl && webContainer && (
          <div className="flex flex-col h-full min-w-96">
            <div className="address_bar">
              <input
                type="text"
                onChange={(e) => {
                  setiframeurl(e.target.value);
                }}
                value={iframeurl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>
            <iframe src={iframeurl} className="w-full h-full"></iframe>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className=" overflow-y-auto hide-scrollbar fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-[#111] to-[#1f1f1f] border border-white/10 shadow-[0_0_30px_rgba(0,255,255,0.1)] text-white rounded-2xl w-[26rem] max-w-full max-h-[30rem] overflow-y-auto p-6 backdrop-blur-lg"
          >
            {/* ❌ Top-Right Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-cyan-400 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <h2 className="text-xl font-bold text-cyan-300 mb-4 border-b border-cyan-500/30 pb-2">
              👥 Select Collaborators
            </h2>

            <ul className="space-y-3">
              {alluser.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    if (selectedUser.includes(user._id)) {
                      SetSelectedUser(
                        selectedUser.filter((id) => id !== user._id)
                      );
                    } else {
                      SetSelectedUser([...selectedUser, user._id]);
                    }
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
              ${
                selectedUser.includes(user._id)
                  ? "bg-cyan-700/50 border border-cyan-300/30"
                  : "hover:bg-white/10"
              }`}
                >
                  <div className="h-8 w-8 bg-cyan-600 flex justify-center items-center rounded-full text-white">
                    <i className="ri-user-fill"></i>
                  </div>
                  <span className="text-base font-medium">{user.email}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => addUser()}
                className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md transition-all"
              >
                Add Collaborators
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default Project;

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

import {getwebcontainer} from "../src/config/webcontainer"

const Project = () => {
  const location = useLocation();
  const [is_slide_bar_open, set_slide_bar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, SetSelectedUser] = useState([]);
  const [alluser, setUsers] = useState([]);
  const [project, setproject] = useState(location.state.item);
  const [message, setmessage] = useState("");
  const { user } = useContext(UserContext);
  const[selectedfile,setselectedfile] = useState(null);
  const [receiveMessSage,setreceiveMessage] = useState([]);
  const[openfile,setopenfile] = useState([]);
  const[fileTree,setfileTree] = useState({})
 const [webContainer,setwebContainer] = useState(null);

  useEffect(() => {

    axios
      .get(`/projects/get_project/${location.state.item._id}`)
      .then((res) => {
        setproject(res.data.project);
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
    console.log("Raw socket data:", data.message); // ✅ log before parsing
    const parsed = JSON.parse(data.message);
    console.log("parsed_datta :" , parsed)
    if (parsed.fileTree) {
      setfileTree(parsed.fileTree);
      webContainer.mount(parsed?.fileTree)
      setopenfile([]);
    }

    console.log("🔥 Message received on frontend:", parsed);
    setreceiveMessage((prev) => [...prev, data]);

  } catch (err) {
    // console.error("❌ JSON parsing error:", err.message);
    // console.error("Offending message:", data.message);
    console.log(err)
  }
};

     

      receiveMessage("project-message", handler);

          return () => {
    // only removes this handler
    socket.off("project-message", handler); // clean old listener
  }; 
  
}},[project]);

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
 useEffect(()=>{
        scrolltobottom();
      },[receiveMessSage])


  function appendoutgoingmessage() {
    const messagediv = document.querySelector(".message-section");
    const new_div = document.createElement("div");
    new_div.classList.add(
      "message",
      "bg-slate-100",
      "rounded-md",
      "m-1",
      "max-w-64",
      "p-1",
      "ml-auto",
      "flex",
      "flex-col",
      "gap-1"
    );
    new_div.innerHTML = `
   <small className='opacity-65 text-xs'>${user.email}</small>
      <p className='text-[0.9rem]'>${message}</p>
  `;
    messagediv.appendChild(new_div);
    scrolltobottom();
  }

  function scrolltobottom() {
    messagebox.current.scrollTop = messagebox.current.scrollHeight;
  }

function appendAiMessage(messageObject)
{
  const AImessage = JSON.parse(messageObject);
  return (
     <div className=" p-2 rounded-2xl overflow-auto max-w-96 text-white bg-black ">
                    <Markdown>{AImessage.text}</Markdown> 
                </div>
  )
}

useEffect(() => {
  console.log("crossOriginIsolated:", window.crossOriginIsolated); 
  if (webContainer === null) {
    getwebcontainer().then(container => {
      setwebContainer(container);
      console.log("✅ WebContainer created and stored in ref ",container);
    }).catch(err => {
      console.error("❌ Failed to get WebContainer:", err);
    });
  }
}, []);

 
function getLanguage(filename) {
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

  return (
    <main className="h-screen w-screen flex  bg-black">
      <section className="left_Section relative flex flex-col h-screen w-96  bg-slate-300">
        <header className="w-[100%] z-100 p-3 bg-gray-200 flex justify-between absolute top-0">
          <button
            onClick={() => {
             
              setIsModalOpen(!isModalOpen);
            }}
            className="bg-slate-500 rounded-full p-5 h-[2rem] w-[2rem] flex justify-center items-center"
          >
            <i className="ri-user-add-fill"></i>
            
          </button>
          <button
            onClick={() => {
              console.log("you clicked");
              set_slide_bar(!is_slide_bar_open);
            }}
            className="h-10 w-10 rounded-full bg-gray-400 cursor-pointer"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversational-area  pt-16 pb-16  relative flex flex-col flex-grow h-full ">
          <div
            ref={messagebox}
            className="message-section  flex flex-grow flex-col gap-3 max-h-full overflow-auto "
          >
            {
              receiveMessSage.map((mssg,indx)=>{

                return (<div className= {`m-1 flex flex-col bg-slate-200  p-2 rounded-2xl ${mssg.sender.email === 'AI'? "max-w-96" : "max-w-64"}`}>
                  <small className="font-medium text-black">{mssg.sender.email}</small>
                {mssg.sender.email == 'AI' ? 
               appendAiMessage(mssg.message)
              
                : <p>{mssg.message}</p>}
                </div>)
              })
            }
          </div>

          <div className="input-section w-full flex justify-center absolute bottom-0  items-center">
            <input
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              type="text"
              placeholder="Enter your text"
              className="w-11/12 shadow-2xl bg-white p-2.5 "
            />
            <button
              onClick={send}
              className="flex cursor-pointer p-3 bg-black text-white flex-grow justify-center items-center  h-[95%] shadow-2xl"
            >
              <i className="ri-send-plane-fill "></i>
            </button>
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
          {
            Object.keys(fileTree).map((filename,indx)=>{
              return(<div className="file_tree w-full flex flex-col p-2 my-2">
           <button
           onClick={()=>{
            console.log("you just clicked")
            setselectedfile(filename)
           
            if(!openfile.includes(filename))
            {
                setopenfile([...openfile,filename])
            }
         
            
           }}
            className=" file_tiles rounded-md bg-slate-400 p-2 w-full">
            <p className="font-bold w-full  cursor-pointer ">
              {filename}
            </p>
           </button>
          </div>)
            })
          }
        </div>


   {selectedfile && (
  <div className="code_editor h-full flex flex-col flex-grow shadow-2xl bg-slate-200">
    <div className="top flex flex-row gap-2">
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

    <div className="bottom h-full bg-slate-900 flex flex-grow w-full overflow-auto">
      {fileTree[selectedfile] && (
        <SyntaxHighlighter
          language={getLanguage(selectedfile)}
          style={vscDarkPlus}
          customStyle={{
            flexGrow: 1,
            width: "100%",
            padding: "1rem",
            fontSize: "0.9rem",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: "0.5rem",
          }}
          wrapLongLines
          showLineNumbers
        >
          {fileTree[selectedfile].file.contents}
        </SyntaxHighlighter>
      )}
    </div>
  </div>
)}

        
      </section>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white scroll-auto rounded-lg shadow-lg w-96 max-w-full max-h-96 overflow-auto  p-6">
            <h2 className="text-xl font-semibold shadow-2xl mb-4">Select a User</h2>
            <ul>
              {alluser.map((user) => (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-pink-200 transition ${
                    selectedUser.indexOf(user._id) != -1 ? `bg-slate-300` : ""
                  }`}
                  onClick={() => {
                    if (selectedUser.indexOf(user._id) !== -1) {
                      SetSelectedUser(
                        selectedUser.filter((id) => id !== user._id)
                      );
                    } else {
                      SetSelectedUser([...selectedUser, user._id]);
                    }
                  }}
                >
                  <div className="h-8 w-8 bg-gray-600 flex justify-center items-center rounded-full text-white">
                    <i className="ri-user-fill"></i>
                  </div>
                  <span className="text-base font-medium">{user.email}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <button
                className="mt-6 w-fit p-3 font-bold bg-gray-400 hover:bg-gray-600 text-black shadow-2xl py-2 rounded transition"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="mt-6 w-[10rem]  p-3 font-bold bg-blue-300 hover:bg-blue-400 text-black shadow-2xl py-2 rounded transition"
                onClick={() => addUser()}
              >
                Add Colobrators
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Project;
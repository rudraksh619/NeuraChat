import React from "react";
import { UserContext } from "../src/context/Usercontext";
import { useState } from "react";
import axios from "../src/config/axios.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  // const {user} = useContext(UserContext);
  const [ismodalopen, setmodalopen] = useState(false);
  const [projectname, setprojectname] = useState("");
  const [project,setproject] = useState([]);

  const navigate = useNavigate();
  const creteProject = (e) => {
    e.preventDefault();
    console.log({ projectname });
    axios
      .post("/projects/create", {
        name: projectname,
      })
      .then((res) => {
        {
          console.log(res.data);
          setmodalopen(false);
          setprojectname("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(()=>{
    axios.get('/projects/getall').then((res)=>{
      setproject(res.data.projects);
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    });
  },[])

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      <div className="projects">
        <button
          className="project p-5 flex gap-2 border-gray-300 bg-slate-100 rounded-2xl shadow-lg"
          onClick={() => setmodalopen(true)}
        >
          <p>New Project</p>
          <i className="ri-link"></i>
        </button>
      </div>

      {
        project.map((item)=>{
          return (
             <div key={item._id}  
             onClick={()=> navigate('/project',{
              state : {item}
             })} 
             className="m-2 mb-2.5 p-3 flex flex-col gap-3 shadow w-56 rounded-s hover:bg-amber-50 cursor-pointer">
          <h2 className="font-semibold">{item.name}</h2>
          <div className="flex gap-2">
           <small>
            <i className="ri-user-line"></i>
           </small>
           <small>
            contributors {item.users.length}
           </small>
          </div>
         </div>
          );
        })
      }


      {ismodalopen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Project</h2>
            <form onSubmit={creteProject}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                onChange={(e) => setprojectname(e.target.value)}
                value={projectname}
                type="text"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter project name"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setmodalopen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;

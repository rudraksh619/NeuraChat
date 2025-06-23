import React, { useState ,useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../src/context/Usercontext";
import axios from "../src/config/axios.js";
const Register = () => {

  const navigate = useNavigate();

  const[email,setemail] = useState("");
  const[password,setpassword]=useState("");
  const {setUser} = useContext(UserContext);
function handleregestration(e){
  e.preventDefault();
  console.log({email,password});
  axios.post('/users/register', { email, password })

.then((res)=>{
  localStorage.setItem('token', res.data.token);
  setUser(res.data.user);
    console.log(res);
     navigate('/');
  }).catch((err) =>{
    console.log(err.response.data);
  })
}
  return (
    <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl font-bold text-center">Register</h2>
        <form className="mt-4" onSubmit={handleregestration}>
          <input
          onChange={(e)=>{
            setemail(e.target.value)
          }}
            type="email"
            placeholder="Email"
            className="w-full  p-2 mt-2 rounded bg-gray-700 text-white"
          />
          <input
          onChange={(e)=>{
            setpassword(e.target.value)
          }}
            type="password"
            placeholder="Password"
            className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
        <p className="text-white text-sm mt-4 text-center">
          Have an account?{" "}
          <Link to="/login" className="text-blue-400">Sign_in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
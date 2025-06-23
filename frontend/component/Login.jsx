import React,{useContext,useState} from "react";
import {UserContext} from '../src/context/Usercontext'
import axios from '../src/config/axios.js';
import { Link,useNavigate } from "react-router-dom";


const Login = () => {

    const [email,setemail] = useState('');
    const [password,setpassword] = useState('');

    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();


    //  hadling  the user to login  
    function submithandler(e){
      e.preventDefault();
        axios.post('/users/login',{
            email,password,
        }).then((res)=>{
          console.log(res.data.token);
          localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
            console.log(res.data.user._id);

            navigate('/')
        }).catch((err)=>{
            console.log(err.response.data);

        })
    }
  return (
    <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl font-bold text-center">Login</h2>
        <form  
        className="mt-4"
        onSubmit={submithandler}>
          <input
          onChange={(e)=>setemail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
          />
          <input
          onChange={(e) => {setpassword(e.target.value)}}
            type="password"
            placeholder="Password"
            className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        </form>
        <p className="text-white text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/regester" className="text-blue-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
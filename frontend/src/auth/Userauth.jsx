import React from 'react'
import { UserContext } from '../context/Usercontext'
import { useContext } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Userauth = ({children}) => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const token = localStorage.getItem('token')
    useEffect(()=>{
        if(!user){
            navigate('/login')
        }
        if(!token)
        {
            navigate('/login');
        }
    },[user,token])
  return (
   <>
   {children}
   </>
  )
}

export default Userauth


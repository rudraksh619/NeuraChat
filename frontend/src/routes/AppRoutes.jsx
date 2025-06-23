import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Login from "../../component/Login";
import Register from "../../component/Register";
import Home from "../../component/Home"
import Project from "../../component/Project";
import Userauth from "../auth/Userauth";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element = {<Userauth>
          <Home/>
        </Userauth>}/>
        <Route path="/login" element = {<Login/>} />
        <Route path="/regester" element = {<Register/>}/>
        <Route path="/project" element = {<Userauth><Project/></Userauth>} />
      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;

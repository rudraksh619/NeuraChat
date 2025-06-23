
import socket from "socket.io-client";

let socket_instance = null;

//  create the function whcih make theconnection with server and client

export const creating_socket = (ProjectId) => {
  if (!socket_instance) {
    socket_instance = socket(import.meta.env.VITE_API_URL, {
      auth: {token : localStorage.getItem("token")},
      query:{
        project_id:ProjectId,
      }
    });
  }
socket_instance?.on('connect', () => {
  console.log(" Connected to socket server");
});

socket_instance?.on('connect_error', (err) => {
  console.log(" Connection error:", err.message);
});
  return socket_instance;
};

export const receiveMessage = (eventName, callback) => {
  console.log("Is socket_instance null?", socket_instance === null);
    socket_instance.on(eventName, callback);

    // console.log(data);
}

export const sendMessage = (eventName,data)=>{
 
  socket_instance.emit(eventName,data)
  console.log(data);
}   




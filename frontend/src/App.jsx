import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/Usercontext";
const App = () => {
  return (
    <div>
      <React.StrictMode>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </React.StrictMode>
    </div>
  );
};

export default App;

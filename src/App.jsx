import { useState } from "react";
import "./App.css";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  const [user, setUser] = useState(null); // User state managed here

  return (
    <>
      <Navbar user={user} setUser={setUser} /> 
      <Profile user={user} setUser={setUser} />  
      <Home user={user} setUser={setUser} /> 
    </>
  );
}

export default App;

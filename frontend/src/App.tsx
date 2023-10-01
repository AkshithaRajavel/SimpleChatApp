import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Room from './pages/Room';
import Nopage from './pages/Nopage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext,useEffect,useState } from 'react';
import {io} from "socket.io-client"
const MainContext = createContext<any>({})
function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [user,setUser] = useState("")
  const [socket,setSocket] = useState<any>({})
  useEffect(()=>{
    const token = window.localStorage.getItem("token")
    if(token){
      fetch("http://localhost:4000/api/isLoggedIn",{
      headers:{
        'Authorization': `Bearer ${token}`
    }
    }).then((response)=>response.json())
    .then((data)=>{
      setIsLoggedIn(data.status)
      setUser(data.email)
      const Socket = io("http://localhost:4000",{
        auth:{
          token:token
        }
      })
      setSocket(Socket)
    })
    }
  },[])
  return (
    <MainContext.Provider value={{isLoggedIn,setIsLoggedIn,socket,setSocket,user,setUser}}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={isLoggedIn?<Home />:<Login/>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="room" element={isLoggedIn?<Room/>:<Login/>} />
        <Route path="*" element={<Nopage />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </MainContext.Provider>
  );
}
export {MainContext}
export default App;

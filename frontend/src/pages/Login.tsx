import { useContext } from "react"
import { MainContext } from "../App"
import {io} from "socket.io-client"
function Login(){
    const {setIsLoggedIn,setSocket,setUser} = useContext(MainContext)
    async function submit(){
        const email = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value
        const response = await fetch('http://localhost:4000/api/login',
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify({email:email,password:password})
        }
        )
        if(response.status==200){
            const payload = await response.json()
            setIsLoggedIn(true)
            setUser(payload.email)
            const Socket = io("/",{
                auth:{
                token:payload.token
                }
            })
            setSocket(Socket)
            window.localStorage.setItem("token",payload.token)
            window.location.href = "/"
        }
        else{
            const payload = await response.json();
            (document.getElementById("error")as HTMLDivElement).innerText = payload.message
        }
        return ;
    }
    return(
        <>
        <h2>Login</h2>
        <label>Username
        <input id="email"/>
        </label>
        <label>Password
        <input id="password"/>
        </label>
        <button onClick={submit}>login</button>
        <div id="error"></div>
        </>
    )
}
export default Login
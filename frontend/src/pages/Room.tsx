import { useSearchParams } from 'react-router-dom';
import {useState,useEffect,useContext} from "react"
import { MainContext } from '../App';
interface listItem{
    user:string
}
function Listusers(props:listItem){
    return <li>{props.user}<br /></li>
}
interface conversation{
    userEmail:string,
    message:string,
}
function Room(){
    const {socket,user} = useContext(MainContext)
    const [searchParams] = useSearchParams();
    const [name,setName] = useState<string>("")
    const [description,setDescription] = useState<string>("")
    const [cnt,setCnt] = useState<number>(0)
    const [liveusers,setLiveusers] = useState<string[]>([])
    const [conversations,setConversations] = useState<conversation[]>([])
    const roomId = searchParams.get("roomId")
    useEffect(()=>{
        const token = window.localStorage.getItem("token")
        socket.on("activity",({cnt,liveUsers}:{liveUsers:[],cnt:number})=>{
            setCnt(cnt)
            setLiveusers(liveUsers)
        })
        fetch(`http://localhost:4000/api/joinRoom?roomId=${roomId}`,{
            headers:{
                    'Authorization': `Bearer ${token}`
            }
        })
        .then((response)=>response.json())
        .then((data)=>{
            setName(data.roomName)
            setDescription(data.description)
            socket.emit("join",{roomId:roomId})
        })

        socket.on("message",(messageObj:conversation)=>{
            setConversations(current=>[...current,messageObj])
        })
        return function(){
            socket.emit("leave",{roomId:roomId});
          };
    },[])
    function sendMessage(){
        var messageInput = document.getElementById("message") as HTMLInputElement
        const message = messageInput.value
        messageInput.value = ""
        socket.emit("message",{message,roomId})
        return ;
    }
    return(
    <>
    <h1>Room Name : {name}</h1>
    <p>About :{description}</p>
    <div className='container'>
    <div className='row'>
    <div className='col-10'>
    <div id="conversation">{
    conversations.map((convo)=>
    <div id={convo.userEmail==user?"myConvo":"convo"}>
    <div className="message">
        <b>{convo.userEmail==user?"You":convo.userEmail}:</b>
        {convo.message}
    </div>
    </div>)
    }</div>
    <div id="typeSpace" className='container'>
    <div className='row'>
    <input id="message" className='col-10' placeholder='Message'/>
    <button onClick={sendMessage} className='col-2'>send</button>
    </div>
    </div>
    </div>
    <div className='col-2'>
        <h2>Live Count {cnt}</h2>
        <ul>{liveusers.map(user=><Listusers user={user}/>)}</ul>
    </div>
    </div>
    </div>
    </>
    )
}
export default Room
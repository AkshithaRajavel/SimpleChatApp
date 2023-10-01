import RoomCard from "../components/RoomCard"
import {useState,useEffect,useContext} from "react"
import { MainContext } from "../App"
interface roomType{
    name:string,
    description:string,
    _id:string
    cnt:number
}
function Home(){
    const {socket} = useContext(MainContext)
    const [rooms,setRooms] = useState<roomType[]>([])
    const token = window.localStorage.getItem("token")
    socket.on("roomCount",({roomId,cnt}:{roomId:string,cnt:number})=>{
        let roomCopy = [...rooms]
        let ind = rooms.findIndex((room)=>room._id == roomId)
        if(ind==-1)return
        roomCopy[ind].cnt = cnt
        setRooms(roomCopy)
    })
    useEffect(()=>{
        const token = window.localStorage.getItem("token")
        socket.auth.token = token
        socket.connect()
        fetch("http://localhost:4000/api/getRooms",{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response=>response.json())
        .then(data=>{setRooms(data.rooms);})
        return ()=>{
            socket.removeAllListeners("roomCount");
        }
    },[])
    return (
        <>
        <h1>Chat Application !!!</h1>
        <h2>Enter a room and start chatting !</h2>
        <ul>{
        rooms.map((i)=><RoomCard _id={i._id} name={i.name} description={i.description} cnt={i.cnt}/>)
        }</ul>
        </>
    )
}
export default Home
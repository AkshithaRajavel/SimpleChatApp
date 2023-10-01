import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
interface roomType{
    _id:string,
    name:string,
    description:string
    cnt:number
}
function RoomCard(props:roomType){
    return (
        <div className="card">
            <Link to={`/room?roomId=${props._id}`}><h2>{props.name}</h2></Link>
            <p>{props.description}</p>
            <p>In Room : {props.cnt}</p>
        </div>
    )
}
export default RoomCard
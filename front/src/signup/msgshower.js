import React from 'react'
import { MdCancel } from "react-icons/md";
import './msgshower.css'
export default function Msgshower(props) {
    const hidemsgeshower=()=>{
        const cancelbutton=document.getElementById('canceler')
        props.setmsgtonull()
        cancelbutton.style.display='none'
    }
    return (
        <div 
      id='canceler'
        className='msg-shower-1'
       >
            <p className='sg-err-txt'>{props.msgtorender}</p>
            <p 
              onClick={()=>hidemsgeshower()}
            className='sg-cl'><MdCancel/></p>
        </div>
    )
}

import React from 'react'
import { MdCancel } from "react-icons/md";
import './msgshower.css'
export default function Msgshower() {
    const hidemsgeshower=()=>{
        const cancelbutton=document.getElementById('canceler')
        cancelbutton.style.display='none'
    }
    return (
        <div 
      id='canceler'
        className='msg-shower-1'
       >
            <p className='sg-err-txt'>Your account is successfully created...</p>
            <p 
              onClick={()=>hidemsgeshower()}
            className='sg-cl'><MdCancel/></p>
        </div>
    )
}

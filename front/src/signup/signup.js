import React,{useEffect, useState} from 'react'
import './signup.css'
import {AiOutlineEye} from 'react-icons/ai'
import {AiOutlineEyeInvisible} from 'react-icons/ai'
import {Link} from 'react-router-dom'

export const Signup=()=>{
    const [hidepass,showpass]=useState(false)
    const [hiderepass,showrepass]=useState(false)
    const [hide,show]=useState(true)
    const [hider,showr]=useState(true)
    const [pass,setpass]=useState('')
    const [repass,setrepass]=useState('')
    const [mn,setmn]=useState('')
    const [na,setna]=useState('')
    const password_ref=React.createRef()
    const repassword_ref=React.createRef()
    const insertgapiscript=()=>{
        const script=document.createElement('script')
        script.src='https://apis.google.com/js/platform.js'
        script.onload=async()=>{
            await initialize()
        }
        document.body.appendChild(script)
    }
    const initialize=()=>{

        new Promise((resolve,reject)=>{
            window.gapi.load('auth2',()=>{
            window.gapi.auth2.init({
                    client_id:'262576652815-te31jdsgf459fu8j931mtphgv3t2ng85.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                }).then(response=>{
                    //console.log(response)

                })
               
            })
        })
    window.gapi.load('signin2',()=>{
        
        window.gapi.signin2.render('my-signin2',{width:180,height:32,onsuccess:async()=>{
            const user=window.gapi.auth2.getAuthInstance()
            const ex_user=user.currentUser.get().getBasicProfile().getName()
            //console.log(ex_user)
        }})
    })
    }
    useEffect(()=>{
insertgapiscript()

    })

    
    const hide_or_show=()=>{
            if(hidepass)
            {
                showpass(false)
                password_ref.current.type='password'
            }
            else 
            {
                showpass(true)
                password_ref.current.type='text'
                
            }
        
  
    }

    const Pass_setter=(e)=>{
        setpass(e.target.value)
       if(hide)
       {
           show(true)
       }
       else{
           show(false)
       }
       
    }
    const repass_setter=(e)=>{
        setrepass(e.target.value)
       if(hider)
       {
           showr(true)
       }
       else{
           showr(false)
       }
       
    }
    const hider_or_showr=()=>{
        if(hiderepass)
        {
            showrepass(false)
            repassword_ref.current.type='password'
        }
        else 
        {
            showrepass(true)
            repassword_ref.current.type='text'
            
        }
    

}
    return (
        <div className='div-1-l' >
            <form className='div-form-l-1'>
                <p className='head-l-1'>Signup into account</p>
                <div className='in-div-1'>
                    <input className='in-1' placeholder='name'/> 
                    <span></span>
                </div>
                <div className='in-div-3'>
                    <input className='in-3' placeholder='mobile_no'/> 
                    <span></span>
                </div>
                <div 
                value={pass}
                
                className='in-div-2'>
                    <input 
                    onChange={(e)=>Pass_setter(e)}
                    autoComplete='off'
                    autoCorrect='off'
                    ref={password_ref}
                    className='in-2'
                    placeholder='password' type='password'/> 
                    <span 
                    onClick={()=>hide_or_show()}
                    className='hide-l-1'>{pass?(hidepass? <AiOutlineEye/>:<AiOutlineEyeInvisible/>)
                    :""}</span>
                </div>
                <div 
                value={repass}
                
                className='in-div-4'>
                    <input 
                    onChange={(e)=>repass_setter(e)}
                    autoComplete='off'
                    autoCorrect='off'
                    ref={repassword_ref}
                    className='in-3'
                    value={repass}
                    placeholder='re-password' type='password'/> 
                    <span 
                    onClick={()=>hider_or_showr()}
                    className='hide-l-1'>{repass?(hiderepass? <AiOutlineEye/>:<AiOutlineEyeInvisible/>)
                    :""}</span>
                </div>
                <div className='butt-div-1'>
                    <button className='butt-1'>Signup</button>
                </div>
                <div >
                <button id='my-signin2' className='google-signup'></button>
                </div>
                <div className='last-op-2'>
                    <p>Or already have an account?</p>
                    <Link id='link-1' to='/signin'>Signin</Link>
                    </div>
            </form>
        </div>
    )
}
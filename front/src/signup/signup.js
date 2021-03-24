import React, { useEffect, useState,useReducer } from "react";
import "./signup.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useHistory } from "react-router-dom";
import ReqtoServer from "../_render";
import base from "../baseurl";
import {Mobilenoinvalid, Nameerror,Passwordlengtherror} from '../error/error'
import '../error/error.css'
import { scriptsetup,googleauthenticaion } from "../gapiserver";
import Msgshower from './msgshower'
export const Signup = (props) => {

   const history=useHistory()
   let signupbutton
  let timer1,timer2,timer3,timer4
const initialstate={
na:'',
mn:'',
pass:'',
repass:'',
msg:''
}
const reducer=(state,action)=>{
  // console.log(state)
  switch (action.type)
  {
    case "set_username":
      return {...state,na:action.name}
      case "set_mobile_no":
        return{...state,mn:action.num}
        case "set_password":
          return {...state,pass:action._up}
          case "set_repassword":
            return {...state,repass:action._urp}
              case "Response_msg":
                return {...state,msg:action.payload.msg}
      default:
        return {...state}
  }

}
  const [states, dispatch] = useReducer(reducer,initialstate)

  const [formsubmitter,enableformsubmitter]=useState(false)
  const [mobilenoerror,setmobileerror]=useState(false)
  const [nameerrorshower,setnameerrorshower]=useState(false)
  const [hidepass, showpass] = useState(false);
  const [hiderepass, showrepass] = useState(false);
  const [render_signup_page, setrender_of_signup_page] = useState(null);
  const [renderdiv1, setrenderdiv1] = useState(false);

  const password_ref = React.createRef();
  const repassword_ref = React.createRef();
  const nameref = React.createRef();

  const postuser = async (data) => {
    const data_ = await base.post("/graphqlserver", data);
    return data_;
  };

  const insertgapiscript = async () => {
    const elem=document.getElementById('my-signin2')
    const script = await scriptsetup();
    script.onload = async () => {
    const authinstance= await googleauthenticaion()
    authinstance.attachClickHandler(elem,{},(googleuser)=>{
       console.log(googleuser)
       if(googleuser)
       {
        const googleusername=googleuser.getBasicProfile().getName()
        const googleuseremail=googleuser.getBasicProfile().getEmail()
        const googleusermutation = {
          query: `
              mutation{
                  createGoogleuser(username:"${googleusername}",email:"${googleuseremail}"){
                      username
                  }
              }
              `,
        };
     
         if(googleusername && googleuseremail)
         {
           postuser(googleusermutation).then(payload_res=>{
             if(payload_res.status===200 || payload_res.status===201)
             {
              const { username } = payload_res.data.data.createGoogleuser;
              if (username === "gmail is already in use") {
                            authinstance.signOut()
                            return dispatch({type:'Response_msg',payload:{msg:username}})
                          } else {
                            return dispatch({type:'Response_msg',
                            payload:{msg:'Your account is successfully created'}})
                          }
             }
           })
         }
         authinstance.signOut()
       }
    })
    };
    document.body.appendChild(script);
  };



  // useeffect method
  useEffect(() => {
 signupbutton=document.getElementById('signup_button')
    const _req_by_signup = new ReqtoServer();
    _req_by_signup.render_payload().then((res) => {
      if (res.status === 200 || res.status === 201) {
        const { rendersigninOrnot } = res.data.data;
        if (rendersigninOrnot === "true") {
          setrender_of_signup_page(true);
        } else if (rendersigninOrnot === "false") {
          setrender_of_signup_page(false);
       return history.push('/')
      } else setrender_of_signup_page(true);
      }
    });
    document.body.style.background = "white";
    insertgapiscript();
    shownameerror()
    MobileNoValidator()
    Enablesubmitbutton()
 
  });
  // mobile error
  const MobileNoValidator=()=>{
    const {mn}=states
    const checker_=/[\sA-Za-z\\^+=-_)(!@#$%&*)?/|><.,:;{}['"~`]]/g
    const validmobileno=mn.match(checker_)
    if(mn)
    {
      if(validmobileno || mn.length!==10)
      {
        setmobileerror(true)
    
      }
      else  {
        setmobileerror(false)
      }
    
    }
    else {
      setmobileerror(false)
    }
    }
// name error 
  const shownameerror=()=>{
    const {na}=states
  const checker=/^[A-Z]{3,}/gi
  const checker1=/[\s!@#$%^&*()\-_+=\\?><.,/"':;~`|]/
  const matcher=na.match(checker)
  const spacechecker =na.match(checker1)
if(states.na)
{
  if(!matcher || spacechecker )
  {
    setnameerrorshower(true)
  }
  else{setnameerrorshower(false)}
  }
  else setnameerrorshower(false)     
}
  const Enablesubmitbutton=(e)=>{
    const {mn,na,pass,repass}=states
    if(signupbutton)
    {
      if(mn && na && pass && repass 
        && pass===repass && 
        pass.length>=8 && !mobilenoerror
         && !nameerrorshower 
         )
      {
        enableformsubmitter(true)
        signupbutton.disabled=false
        signupbutton.style.background='#0ec253'
      }
      else 
      {
        enableformsubmitter(false)
        signupbutton.disabled=true
        signupbutton.style.background="#5cdb95"
      }
    }
  }

  const hide_or_show = () => {
    if (hidepass) {
      showpass(false);
      password_ref.current.type = "password";
    } else {
      showpass(true);
      password_ref.current.type = "text";
    }
  };
  const hider_or_showr = () => {
    if (hiderepass) {
      showrepass(false);
      repassword_ref.current.type = "password";
    } else {
      showrepass(true);
      repassword_ref.current.type = "text";
    }
  };

  //submit the form
  const submit_form = (e) => {
    e.preventDefault();
    if (formsubmitter) {
      console.log("done");
      const {na,pass,mn}=states
      const register_user = {
        query: `
            mutation{
                createMobileuser(username:"${na}",password:"${pass}",mobile_no:"${mn}"){
                    username
                }
            }
            `,
      };
      const signupbutton_=document.getElementById('signup_button')
      signupbutton_.innerText='Signing up...'
      signupbutton_.disabled=true
      signupbutton_.style.background='#5cdb95'
     
      postuser(register_user).then((response) => {
       const {username}=response.data.data.createMobileuser
        if (response.status !== 200 && response.status !== 201) {
          signupbutton_.innerText='Signup'
          signupbutton_.style.background='#0ec253'
          signupbutton_.disabled=false
          throw new Error("server error");
        } else if(username==="mobile no. is already in use"){
          signupbutton_.innerText='Signup'
          signupbutton_.style.background="#0ec253"
          signupbutton_.disabled=false
          return dispatch({type:'Response_msg',payload:{msg:username}})
        }
        else {
          signupbutton_.innerText='Signup'
          signupbutton_.style.background="#0ec253"
          signupbutton_.disabled=false
          return dispatch({type:"Response_msg",payload:{msg:"Your account is created successfully"}})
        }
      });
    }
    // setrenderdiv1(true);
  };
  //set the response msge to null
  const setmsgtonull=()=>{
    return dispatch({type:"Response_msg",payload:{msg:''}})
  }
  const goback=(e)=>{
    e.preventDefault()
    setrenderdiv1(false)
  }
  const submit_form_=(e)=>{
     e.preventDefault()
  }
  if (render_signup_page && !renderdiv1)

    return (
      <div className="div-1-l">
       {states.msg?<Msgshower 
       setmsgtonull={setmsgtonull}
       msgtorender={states.msg}/>:<></> } 
        <form className="div-form-l-1 div-form-shu-l-1"  
        onSubmit={(e) => submit_form(e)}>
          <p className="head-l-1">Signup into account</p>
          <div className="in-div-1">
            <input
              ref={nameref}
              // onBlur={(e) => Name_setter(e)}
              // onBlur={(e)=>{
              //   return dispatch({type:"set_username",name:e.target.value})
              // }}
              onKeyUp={(e)=>{
                clearTimeout(timer1)

                timer1=setTimeout(()=>{
                  
                  return dispatch({type:"set_username",name:e.target.value})
                },400)
              }}
              onKeyPress={()=>{
                clearTimeout(timer1)
              }}
              className="in-1"
              placeholder="name"
            />
            <span></span>
          </div>
             {nameerrorshower?<span className="er-l-0">
            <Nameerror/>
          </span>:<></>}
          <div className="in-div-3">
            <input
              onKeyUp={(e)=>{
                clearTimeout(timer2)
                timer2=setTimeout(()=>{
                  MobileNoValidator(e.target.value)
                  return dispatch({type:"set_mobile_no",num:e.target.value})
                },400)
              }}
              onKeyPress={()=>{
                clearTimeout(timer2)
              }}
              className="in-3"
              placeholder="mobile_no"
            />
            <span></span>
          </div>
         {mobilenoerror? <span className='er-l-1'>
            <Mobilenoinvalid/>
          </span>:<></> }

          <div  className="in-div-2">
            <input
              onKeyUp={(e)=>{
                clearTimeout(timer3)
                timer3=setTimeout(()=>{
                  return dispatch({type:"set_password",_up:e.target.value})
                },400)
              }}
              onKeyPress={()=>{
                clearTimeout(timer3)
              }}
              autoComplete="off"
              ref={password_ref}
              className="in-2"
              placeholder="password"
              type="password"
            />
            <span onClick={() => hide_or_show()} className="hide-l-1">
              {states.pass ? (
                hidepass ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )
              ) : (
                ""
              )}
            </span>
          </div>
          {states.pass &&  states.pass.length <8 ?<span className='er-l-2'>
          <Passwordlengtherror/>
          </span>:<></>}
          <div className="in-div-4">
            <input
              onKeyUp={(e)=>{
                clearTimeout(timer4)
                timer4=setTimeout(()=>{
                  return dispatch({type:"set_repassword",_urp:e.target.value})
                },400)
              }}
              onKeyPress={()=>{
                clearTimeout(timer4)
              }}
              autoComplete="off"
              ref={repassword_ref}
              className="in-3"
              placeholder="re-password"
              type="password"
            />
            <span
             onClick={() => hider_or_showr()}
              className="hide-l-1">
              {states.repass ? (
                hiderepass ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )
              ) : (
                ""
              )}
            </span>
          </div>
          <div
          className="butt-div-1">
            <button
            disabled={true}
            onClick={(e)=>submit_form(e)}
            id="signup_button"
            className="butt-1">Signup</button>
          </div>
          <div 
           id="my-signin2"
          className='g0-div'>
            <button
              onSubmit={(e) => submit_form(e)}
             
              className="google-signup"
            >Google Signup</button>
          </div>
          <div className="last-op-2">
            <p>Or already have an account?</p>
            <Link id="link-1" to="/signin">
              Signin
            </Link>
          </div>
        </form>
      </div>
    );
  else if (renderdiv1) {
    return (
      <div className="div-1-l">
        <form className="div-form-l-1">
          <div>
            <h1 className="hh-11">Enter the code</h1>
          </div>
          <input className="co-l-1" placeholder="code"></input>
          <div className="co-div-l-1">
            <button 
            onClick={(e)=>goback(e)}
            className="bt-11">back</button>
            <button 
            onClick={(e)=>submit_form_(e)}
            className="bt-22">submit</button>
          </div>
          <div className='co-div-l-2'>
            <p className='rc-l-11'>Don't receive code?</p>
            <button className='re-l-1-1'>Send again</button>
          </div>
        </form>
      </div>
    );
  } else return <div></div>;
};

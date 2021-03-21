import React, { useEffect, useState,useReducer} from "react";
import "./signin.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link,useHistory} from "react-router-dom";
import Cookie from "universal-cookie";
import base from "../baseurl";
import { gapisetup } from "../gapiserver";
import { scriptsetup,googleauthenticaion } from "../gapiserver";

export const Signin = () => {
  const history=useHistory()
  const cookie = new Cookie();
  let timer
const initialState={
  m_b:'',
  u_p:''
}
const reducer=(state,action)=>{
  switch(action.type){
    case "M_B":
      return {...state,m_b:action.payload.m_b}
    case "U_P":
      return {...state,u_p:action.payload.u_p}
      default:
        return {...state}
  }
}
const [state, dispatch] = useReducer(reducer, initialState)



  const [hidepassword, showpassword] = useState(false);
  const [render, setrender] = useState(null);
  const password_ref = React.createRef();

  const insertgapiscript = async () => {
    const elem=document.getElementById('g-signin')
    const script = await scriptsetup();
    script.onload = async () => {
      const authinstance= await googleauthenticaion()
      authinstance.attachClickHandler(elem,{},(googleuser)=>{
        console.log(googleuser)
        if(googleuser)
        {
          const googleuseremail=googleuser.getBasicProfile().getEmail()
          const _em = {
            query: `
                        query{
                            signedInGoogleusers(email:"${googleuseremail}"){
                                username
                            }
                        }
                        `,
          };
          if(googleuseremail)
          {
            signedinuser(_em).then(async payload_res=>{
              const { username } = payload_res.data.data.signedInGoogleusers;
              if (username === "error" || username === "email not found") {
                await authinstance.signOut()
              } else {
                const date = new Date();
                const expiredate = date.setTime(date.getTime() + 36000000);
                cookie.set("mb_", "false", {
                  path: "/",
                  expires: new Date(expiredate),
                });
                return  history.push('/home')
              }
            })
          }

        }
      })
    };
    document.body.appendChild(script);
  };

  const signedinuser = async (data) => {
    const result = await base.post("/graphqlserver", data);
    return result;
  };

  // use effect method
  useEffect(async () => {
    console.log(state.m_b,state.u_p)
    document.body.style.background = "white";
    const _req = new ReqtoServer();
      await _req.render_payload().then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const { rendersigninOrnot } = res.data.data;
          if (rendersigninOrnot === "true") {
            const script=await scriptsetup()
            script.onload=async ()=>{
           const gapiserver=await gapisetup()
           const authinstance=gapiserver.auth2.getAuthInstance()
           authinstance.signOut()   
            }
           setrender(true);
           document.body.appendChild(script)
          } else if (rendersigninOrnot === "false") {
            return history.push('/home')
          } else setrender(true);
        }
      });
      insertgapiscript();
  });




 
  // object funtion
  function ReqtoServer() {
    const render = {
      query: `
            query{
                rendersigninOrnot
            }
            `,
    };
    this.render_payload = async function () {
      return await base.post("/graphqlserver", render);
    };
  }

  const hide_or_show = () => { 
    if (hidepassword) {
      showpassword(false);
      password_ref.current.type = "password";
    } else {
      showpassword(true);
      password_ref.current.type = "text";
    }
  };
  const signeduser = (e) => {
    e.preventDefault();
    if (state.m_b && state.u_p) {
      const _da = {
        query: `
                query{
                    signedInMobileusers(pass:"${state.u_p}",mobile_no:"${state.m_b}"){
                        username
                    }
                }
                `,
      };
      const button = document.querySelector("#butt_");
      button.disabled = true;
      signedinuser(_da)
        .then((res) => {
          if(res.status===201 || res.status===200) {
            const { username } = res.data.data.signedInMobileusers;
            if (username === "mobile_no not found" || username === "wrong password") {
               button.disabled=false
            } else {
              const date = new Date();
              const expiredate = date.setTime(date.getTime() + 36000000);
              cookie.set("mb_", "true", {
                path: "/",
                expires: new Date(expiredate),
              });
             history.push('/home')
            }
          }
        })
    }
  };
  if (render)
    return (
      <div className="div-1-l">
        <form
          className="div-form-l-1"
          onSubmit={(e) => {
            signeduser(e);
          }}
        >
          <p className="head-l-1">Signin into account</p>
          <div className="in-div-1">
            <input
            autoComplete="off"
            id="in_f_1" 
            // onBlur={(e)=>{
            //     return dispatch({type:"M_B",payload:{m_b:e.target.value}})
            //   }}
            onKeyUp={(e)=>{
              clearTimeout(timer)
              timer=setTimeout(()=>{
                return dispatch({type:"M_B",payload:{m_b:e.target.value}})
              },1000)
            }}
            onKeyPress={()=>{
              clearTimeout(timer)
            }}
          //   onBlur={(e)=>{
          //  return  dispatch({type:"M_B",payload:{m_b:e.target.value}})
          //   }}
              className="in-1"
              placeholder="mobile_no"
            />
            <span></span>
          </div>
          <div
            className="in-div-2"
          >
            <input
              autoComplete="off"
              // onChange={(e)=>{  
              //   return dispatch({type:"U_P",payload:{u_p:e.target.value}})
              // }}
              // onInput={(e)=>{
              //   console.log(e.target.value)
              // }}
              onKeyUp={(e)=>{
                clearTimeout(timer)
                timer=setTimeout(()=>{
                  console.log(e.target.value)
                  return dispatch({type:"U_P",payload:{u_p:e.target.value}})
                },1000)
              }}
              onKeyPress={(e)=>{
                clearTimeout(timer)
              }}
              autoCorrect="off"
              ref={password_ref}
              className="in-2"
              placeholder="password"
              type="password"
            />
            <span onClick={() => hide_or_show()} className="hide-l-1">
              {state.u_p ? (
                hidepassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )
              ) : (
                ""
              )}
            </span>
          </div>
          <div className="butt-div-1">
            <button
              onClick={(e) => {
                signeduser(e);
              }}
              id="butt_"
              className="butt-1"
            >
              Signin
            </button>
          </div>
          <div 
             id="g-signin"
          className='g1-div'>
            <button
              onClick={(e) => signeduser(e)}
              className="google-signin"
            >Google signin</button>
          </div>
          <div className="last-op-1">
            <p>Or don't have an account?</p>
            <Link id="link-1" to="/signup">
              Signup
            </Link>
          </div>
        </form>
      </div>
    );
  else {
    return (
      <div></div>
      // <div className="loader">
      //   <Loader type="Bars" width={80} height={40} />
      // </div>
    );
  }
};

import React, { useEffect, useState, useReducer } from "react";
import "./signin.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useHistory } from "react-router-dom";
import Cookie from "universal-cookie";
import Loader from 'react-loader-spinner'
import base from "../baseurl";
import { gapisetup } from "../gapiserver";
import { MdCancel } from "react-icons/md";
import { Mobilevalidator } from "../validator";
import { Mobilenoinvalid } from "../error/error";
import { scriptsetup, googleauthenticaion } from "../gapiserver";

export default function Signin(props)  {
  const history = useHistory();
  const cookie = new Cookie();
  let timer1, timer2;
  const initialState = {
    m_b: "",
    u_p: "",
    canceler: false,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "M_B":
        return { ...state, m_b: action.payload.m_b };
      case "U_P":
        return { ...state, u_p: action.payload.u_p };
      case "cancel_errorer":
        return { ...state, canceler: action.payload.canceler };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  let signinbutton;
  const [disablesignin, enablesignin] = useState(false);
  const [hidepassword, showpassword] = useState(false);
  const [render, setrender] = useState(null);
  const password_ref = React.createRef();

  const insertgapiscript = async () => {
    const elem = document.getElementById("g-signin");
    const script = await scriptsetup();
    script.onload = async () => {
      const authinstance = await googleauthenticaion();
      authinstance.attachClickHandler(elem, {}, (googleuser) => {
        console.log(googleuser);
        if (googleuser) {
          const googleuseremail = googleuser.getBasicProfile().getEmail();
          const _em = {
            query: `
                        query{
                            signedInGoogleusers(email:"${googleuseremail}"){
                                username
                            }
                        }
                        `,
          };
          if (googleuseremail) {
            const googlebutton=document.getElementById('google-signin-button')
            signedinuser(_em).then(async (payload_res) => {
              const { username } = payload_res.data.data.signedInGoogleusers;
              if (username === "error" || username === "email not found") {  
                googlebutton.innerText='Google Signin'
                await authinstance.signOut();
              } else {
                const date = new Date();
                const expiredate = date.setTime(date.getTime() + 36000000);
                cookie.set("mb_", "false", {
                  path: "/",
                  expires: new Date(expiredate),
                });
                googlebutton.innerText='Google Signing in...'
                return history.push("/");
              }
            });
          }
        }
      });
    };
    document.body.appendChild(script);
  };

  const signedinuser = async (data) => {
    const result = await base.post("/graphqlserver", data);
    return result;
  };

  // use effect method
  useEffect(async () => {
    signinbutton = document.getElementById("butt_");
    document.body.style.background = "white";
    const _req = new ReqtoServer();
    await _req.render_payload().then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        const { rendersigninOrnot } = res.data.data;
        if (rendersigninOrnot === "true") {
          // const script = await scriptsetup();
          // script.onload = async () => {
          //   const gapiserver = await gapisetup();
          //   const authinstance = gapiserver.auth2.getAuthInstance();
          //   authinstance.signOut();
          // };
          console.log('done')
             setrender(true);
          // document.body.appendChild(script);
        } else if (rendersigninOrnot === "false") {
          return history.push("/");
        } else setrender(true);
      }
    });
    insertgapiscript();
    enablesigninbutton();
  }, [state,props]);

  const validatemobileno = Mobilevalidator(state.m_b);

  const enablesigninbutton = () => {
    const { m_b, u_p } = state;
    if (signinbutton) {
      if (m_b && u_p && !validatemobileno) {
        signinbutton.disabled = false;
        enablesignin(true);
        signinbutton.style.background = "#0ec253";
      } else {
        signinbutton.disabled = true;
        enablesignin(false);
        signinbutton.style.background = "#5cdb95";
      }
    }
  };

  const signinbuttonuichanger=(button)=>
  {
    button.disabled = true;
    button.innerText="Signing in...."
    button.style.background='#5cdb95'
  }
  // object funtion
  function ReqtoServer() {
    const render = {
      query: `
            query{
                rendersigninOrnot
            }
            `,
    };
    this.render_payload =async function () {
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
  const signeduser = async(e) => {
    e.preventDefault();
    const { u_p, m_b } = state;
    if (disablesignin) {
      const _da = {
        query: `
                query{
                    signedInMobileusers(pass:"${u_p}",mobile_no:"${m_b}"){
                        username
                    }
                }
                `,
      };
      const button = document.querySelector("#butt_");
     signinbuttonuichanger(button)
      signedinuser(_da).then(async(res) => {
        if (res.status === 201 || res.status === 200) {
          const { username } = res.data.data.signedInMobileusers;
          if (
            username === "mobile_no not found" ||
            username === "wrong password"
          ) {
            button.innerText="Signin"
            button.style.background = "#0ec253";
            button.disabled = false;
            return dispatch({
              type: "cancel_errorer",
              payload: { canceler: true },
            });
          } else {
           await signinbuttonuichanger(button)
            const date = new Date();
            const expiredate = date.setTime(date.getTime() + 36000000);
            cookie.set("mb_", "true", {
              path: "/",
              expires: new Date(expiredate),
            });
            history.push("/");
          }
        }
      });
    }
  };
  if (render)
    return (
      <div className="div-1-l">
        {state.canceler ? (
          <div className="err-alerter">
            <p className="wr-er">Incorrect mobile no. or password</p>
            <button
              onClick={() => {
                return dispatch({
                  type: "cancel_errorer",
                  payload: { canceler: false },
                });
              }}
              className="cr-er"
            >
              <MdCancel />
            </button>
          </div>
        ) : (
          <></>
        )}
        <form
          className="div-form-l-1 div-form-shd-l-1"
          onSubmit={(e) => {
            signeduser(e);
          }}
        >
          <p className="head-l-1">Signin into account</p>
          <div className="sgn-div-1">
            <input
              autoComplete="off"
              id="in_f_1"
              onKeyUp={(e) => {
                clearTimeout(timer1);
                timer1 = setTimeout(() => {
                  return dispatch({
                    type: "M_B",
                    payload: { m_b: e.target.value },
                  });
                },400);
              }}
              onKeyPress={() => {
                clearTimeout(timer1);
              }}
              className="in-1"
              placeholder="mobile_no"
            />
            <span></span>
          </div>
         {validatemobileno?<span className='er-l-1'>
            <Mobilenoinvalid />
          </span>:<></>}
          <div className="sgn-div-2">
            <input
              autoComplete="off"
              onKeyUp={(e) => {
                clearTimeout(timer2);
                timer2 = setTimeout(() => {
                  return dispatch({
                    type: "U_P",
                    payload: { u_p: e.target.value },
                  });
                },400);
              }}
              onKeyPress={(e) => {
                clearTimeout(timer2);
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
          <div className="butt-div-2">
            <button
              disabled={true}
              onClick={(e) => {
                signeduser(e);
              }}
              id="butt_"
              className="butt-1"
            >
              Signin
            </button>
          </div>
          <div id="g-signin" className="g1-div">
            <button 
            id="google-signin-button"
            onClick={(e) => signeduser(e)}
             className="google-signin">
              Google Signin
            </button>
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
    else  {
      const styles = {
        display: "flex",
        justifyContent: "center",
        height: " 100vh",
        alignItems: "center",
      };
      return <Loader style={styles} type="Oval" width={80} height={40}></Loader>;
    }
};

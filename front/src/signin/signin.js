import React, { useEffect, useState } from "react";
import "./signin.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link,useLocation,useHistory} from "react-router-dom";
import Cookie from "universal-cookie";
import base from "../baseurl";
import Loader from "react-loader-spinner";
import { gapisetup } from "../gapiserver";
import { scriptsetup } from "../gapiserver";

export const Signin = () => {
  const location=useLocation()
  const history=useHistory()
  const cookie = new Cookie();
  // const _name = new WeakMap();
  // function fun(params) {
  //   _name.set(this, "kyle");
  //   this.name = "naren";
  //   this.age = 12;
  //   this.fun2 = function () {
  //     return "naren";
  //   };
  //   //  console.log(_name.get(this))
  // }
  //   const fun1 = new fun();
  //   const names = _name.get(fun1);
  //   console.log(fun1.fun2());

  const [hidepassword, showpassword] = useState(false);
  const [hide, show] = useState(true);
  const [render, setrender] = useState(null);
  const [password, setpassword] = useState("");
  const [mn_, setmn_] = useState("");
  const password_ref = React.createRef();

  const insertgapiscript = async () => {
    const script = await scriptsetup();
    script.onload = async () => {
      const gapiserver = await gapisetup();
      gapiserver.load("signin2", () => {
        gapiserver.signin2.render("g-signin", {
          width: 180,
          height: 32,
          onsuccess: async () => {
            const user = gapiserver.auth2.getAuthInstance();
            const ex_email = user.currentUser
              .get()
              .getBasicProfile()
              .getEmail();
            const _em = {
              query: `
                          query{
                              signedInGoogleusers(email:"${ex_email}"){
                                  username
                              }
                          }
                          `,
            };
            signedinuser(_em)
              .then((res) => {
                if (res.status !== 201 && res.status !== 200){
                }
                else {
                  return res.data;
                }
              })
              .then(async (finalresponse) => {
                const { username } = finalresponse.data.signedInGoogleusers;
                if (username === "error" || username === "email not found") {
                  await gapiserver.auth2.getAuthInstance().signOut();
                  // window.location.replace('/signin')
                } else {
                  const date = new Date();
                  const expiredate = date.setTime(date.getTime() + 36000000);
                  cookie.set("mb_", "false", {
                    path: "/",
                    expires: new Date(expiredate),
                  });
                    history.goBack()
                }
              });
          },
        });
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
             history.push('/home')
          } else setrender(true);
        }
      });
    insertgapiscript();
  },[insertgapiscript]);

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
  const Password_setter = (e) => {
    setpassword(e.target.value);
    if (hide) {
      show(true);
    } else {
      show(false);
    }
  };
  const set_mn = (e) => {
    setmn_(e.target.value);
  };

  const signeduser = (e) => {
    e.preventDefault();
    if (mn_ && password) {
      const _da = {
        query: `
                query{
                    signedInMobileusers(pass:"${password}",mobile_no:"${mn_}"){
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
              // window.location.replace("/home");
            return   history.push('/home')
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
              onBlur={(e) => set_mn(e)}
              className="in-1"
              placeholder="mobile_no"
            />
            <span></span>
          </div>
          <div
            value={password}
            onChange={(e) => Password_setter(e)}
            className="in-div-2"
          >
            <input
              autoComplete="off"
              autoCorrect="off"
              ref={password_ref}
              className="in-2"
              placeholder="password"
              type="password"
            />
            <span onClick={() => hide_or_show()} className="hide-l-1">
              {password ? (
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
          <div>
            <button
              onClick={(e) => signeduser(e)}
              id="g-signin"
              className="google-signup"
            ></button>
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

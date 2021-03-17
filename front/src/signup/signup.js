import React, { useEffect, useState } from "react";
import "./signup.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import ReqtoServer from "../_render";
import base from "../baseurl";
import { gapisetup } from "../gapiserver";
import { scriptsetup } from "../gapiserver";
export const Signup = () => {
  const [hidepass, showpass] = useState(false);
  const [hiderepass, showrepass] = useState(false);
  const [hide, show] = useState(true);
  const [hider, showr] = useState(true);
  const [render_signup_page, setrender_of_signup_page] = useState(null);

  const [pass, setpass] = useState("");
  const [repass, setrepass] = useState("");
  const [mn, setmn] = useState("");
  const [na, setna] = useState("");

  const password_ref = React.createRef();
  const repassword_ref = React.createRef();
  const nameref = React.createRef();

  const postuser = async (data) => {
    const data_ = await base.post("/graphqlserver", data);
    return data_;
  };

  const insertgapiscript = async () => {
    const script = await scriptsetup();
    script.onload = async () => {
      const gapiserver = await gapisetup();
      gapiserver.load("signin2", () => {
        gapiserver.signin2.render("my-signin2", {
          width: 180,
          height: 32,
          onsuccess: async () => {
            const user = gapiserver.auth2.getAuthInstance();
            const ex_user = user.currentUser.get().getBasicProfile().getName();
            const ex_email = user.currentUser
              .get()
              .getBasicProfile()
              .getEmail();
            const googleusermutation = {
              query: `
                  mutation{
                      createGoogleuser(username:"${ex_user}",email:"${ex_email}"){
                          username
                      }
                  }
                  `,
            };
            postuser(googleusermutation).then((res) => {
              if (res.status === 200 || res.status === 201) {
                const { username } = res.data.data.createGoogleuser;

                if (username === "gmail is already in use") {
                  user.signOut();
                } else {
                }
              }
            });
          },
        });
      });
    };
    document.body.appendChild(script);
  };
  // useeffect method
  useEffect(() => {
    const _req_by_signup = new ReqtoServer();
    _req_by_signup.render_payload().then((res) => {
      if (res.status === 200 || res.status === 201) {
        const { rendersigninOrnot } = res.data.data;
        if (rendersigninOrnot === "true") {
          setrender_of_signup_page(true);
          console.log(rendersigninOrnot);
        } else if (rendersigninOrnot === "false") {
          console.log(rendersigninOrnot);
          setrender_of_signup_page(false);
          window.location.replace("/home");
        } else setrender_of_signup_page(true);
      }
    });
    document.body.style.background = "white";
    insertgapiscript();
  });

  const hide_or_show = () => {
    if (hidepass) {
      showpass(false);
      password_ref.current.type = "password";
    } else {
      showpass(true);
      password_ref.current.type = "text";
    }
  };

  const Pass_setter = (e) => {
    setpass(e.target.value);
    if (hide) {
      show(true);
    } else {
      show(false);
    }
  };
  const repass_setter = (e) => {
    setrepass(e.target.value);
    if (hider) {
      showr(true);
    } else {
      showr(false);
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
  //change_name
  const Name_setter = (e) => {
    setna(e.target.value);
  };
  const Mobile_no_setter = (e) => {
    setmn(e.target.value);
  };

  //submit the form
  const submit_form = (e) => {
    e.preventDefault();
    if (pass && repass && pass === repass && mn && na) {
      console.log("done");
      const register_user = {
        query: `
            mutation{
                createMobileuser(username:"${na}",password:"${pass}",mobile_no:"${mn}"){
                    username
                }
            }
            `,
      };
      postuser(register_user).then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("server error");
        } else {
          // console.log(response)
        }
      });
    }
  };
  if (render_signup_page)
    return (
      <div className="div-1-l">
        <form className="div-form-l-1" onSubmit={(e) => submit_form(e)}>
          <p className="head-l-1">Signup into account</p>
          <div className="in-div-1">
            <input
              ref={nameref}
              onBlur={(e) => Name_setter(e)}
              className="in-1"
              placeholder="name"
            />
            <span></span>
          </div>
          <div className="in-div-3">
            <input
              onBlur={(e) => Mobile_no_setter(e)}
              className="in-3"
              placeholder="mobile_no"
            />
            <span></span>
          </div>
          <div value={pass} className="in-div-2">
            <input
              onChange={(e) => Pass_setter(e)}
              autoComplete="off"
              autoCorrect="off"
              ref={password_ref}
              className="in-2"
              placeholder="password"
              type="password"
            />
            <span onClick={() => hide_or_show()} className="hide-l-1">
              {pass ? (
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
          <div value={repass} className="in-div-4">
            <input
              onChange={(e) => repass_setter(e)}
              autoComplete="off"
              autoCorrect="off"
              ref={repassword_ref}
              className="in-3"
              value={repass}
              placeholder="re-password"
              type="password"
            />
            <span onClick={() => hider_or_showr()} className="hide-l-1">
              {repass ? (
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
          <div className="butt-div-1">
            <button className="butt-1">Signup</button>
          </div>
          <div>
            <button
              onSubmit={(e) => submit_form(e)}
              id="my-signin2"
              className="google-signup"
            ></button>
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
  else
    return (
      <div></div>
    );
};

import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Product from "./product/product";
import { Signin } from "./signin/signin";
import { Signup } from "./signup/signup";
import axios from "axios";
import Loader from "react-loader-spinner";
export default function Index() {
  const [rendersignin, setrendersignin] = useState(null);
  const reqforrendering = async (rendersignin) => {
    const payload = await axios({
      method: "POST",
      url: "http://localhost:5000/graphqlserver",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: rendersignin,
    });
    return payload;
  };
  useEffect(() => {
    const rendersignin = {
      query: `
        query{
            rendersigninOrnot
        }
        `,
    };
    // reqforrendering(rendersignin).then((render_payload) => {
    //   if (render_payload) {
    //     const { rendersigninOrnot } = render_payload.data.data;
    //     console.log(rendersigninOrnot);
    //     if (rendersigninOrnot === "true") {

    //         setrendersignin(true);
     
    //     } else if (rendersigninOrnot === "false") {
    //       console.log("i am running man");
    //       setrendersignin(false);
    //     }
    //   }
    // });
  });
  // if (rendersignin != null)
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/signin"
          
            component={
         
                Signin
                
            }
          />
          <Route
            exact
            path="/signup"
            component={ Signup}
          />
          <Route
            exact
            path="/home"
            component={ Product }
          />
        </Switch>
      </BrowserRouter>
    )
  // else if (rendersignin == null) {
  //   const styles = {
  //     display: "flex",
  //     justifyContent: "center",
  //     height: " 100vh",
  //     alignItems: "center",
  //   };
  //   // window.location.replace("/home");
  //   return <Loader style={styles} type="Bars" width={80} height={40}></Loader>;
  // }
}

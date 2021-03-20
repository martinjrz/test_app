import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Product from "./product/product";
import { Signin } from "./signin/signin";
import { Signup } from "./signup/signup";
import base from "./baseurl";
export default function Index() {
  const [rendersignin, setrendersignin] = useState(null);
  const reqforrendering = async (rendersignin) => {
    const payload = await base.post("/graphqlserver", rendersignin);
    return payload;
  };

  useEffect(() => {

    // const rendersignin = {
    //   query: `
    //     query{
    //         rendersigninOrnot 
    //     }
    //     `,
    // };
    // reqforrendering(rendersignin).then((render_payload) => {
    //   if (render_payload) {
    //     const { rendersigninOrnot } = render_payload.data.data;
    //     console.log(rendersigninOrnot);
    //     if (rendersigninOrnot === "true") {
    //       setrendersignin(true);
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
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/home" render={(props)=><Product  {...props}/>} />
    </BrowserRouter>


  );
  // else if (rendersignin == null) {
  //   const styles = {
  //     display: "flex",
  //     justifyContent: "center",
  //     height: " 100vh",
  //     alignItems: "center",
  //   };
  //   return <Loader style={styles} type="Oval" width={80} height={40}></Loader>;
  // }
}

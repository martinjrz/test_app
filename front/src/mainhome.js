import React, { useEffect, useState,useReducer, lazy, Suspense } from "react";
import loadable from 'react-loadable'
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
// import Product from "./product/product";
// import  Signin from "./signin/signin";

// import  Signup  from "./signup/signup";
import base from "./baseurl";
import Loader from 'react-loader-spinner'


// const Signin=loadable({
//   loader:()=>import ("./signin/signin"),
//   loading:()=> <div className="loader">
//   <Loader type="Oval" width={80} height={40} />
// </div>
// })
const Product=loadable({
  loader:()=>import ("./product/product"),
  loading:()=> <div className="loader">
  <Loader type="Oval" width={80} height={40} />
</div>
})
// const Signup=loadable({
//   loader:()=>import ("./signup/signup"),
//   loading:()=> <div className="loader">
//   <Loader type="Oval" width={80} height={40} />
// </div>
// })

const Signin=lazy(()=>import("./signin/signin"))
const Signup=lazy(()=>import ("./signup/signup"))
export default function Index() {

  const initialestate={
    msg:null
  }
const reducer=(state,action)=>{
  switch(action.type)
  {
    case "Render_msg":
      return {...state,msg:action.msg}
  }
}


  useEffect(() => {



  });
 
  return (
    <div>
      <Suspense fallback={<div style={{display:"flex",maxHeight:"100vh",justifyContent:"center",
    alignItems:"center"
    }}><loader type="Oval" width={80} height={40}></loader></div>}>

      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={(props) => <Product {...props}/>} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </BrowserRouter>
      </Suspense>
    </div>
  );

}

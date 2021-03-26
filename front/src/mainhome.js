import React, { useEffect, useState,useReducer } from "react";
import loadable from 'react-loadable'
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import Product from "./product/product";

// import { Signup } from "./signup/signup";
import base from "./baseurl";
import Loader from 'react-loader-spinner'


const Signin=loadable({
  loader:()=>import ("./signin/signin"),
  loading:()=><div>loading</div>
})

const Signup=loadable({
  loader:()=>import ("./signup/signup"),
  loading:()=><div>loading.....</div>
})

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
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={(props) => <Product />} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </BrowserRouter>
    </div>
  );

}

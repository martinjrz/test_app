import React, { useEffect, useState,useReducer } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import Product from "./product/product";
import { Signin } from "./signin/signin";
import { Signup } from "./signup/signup";
import base from "./baseurl";
import Loader from 'react-loader-spinner'
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

const [state,dispatch]=useReducer(reducer,{initialestate})

  const [rendersignin, setrendersignin] = useState(null);
// request to server on each page rendering 


  useEffect(() => {



  });
 
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={(props) => <Product res={rendersignin} {...props} />} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </BrowserRouter>
    </div>
  );

}

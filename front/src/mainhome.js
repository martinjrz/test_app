import React, { useEffect, useState,useReducer } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  Link,
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
function ReqtoServerfun()
{
this.render_payload = {
    query: `
      query{
          rendersigninOrnot
      }
      `
  };
this.payload_response=async ()=>{
  const payload=await base.post('/graphqlserver',this.render_payload)
  return payload;
}


}

  useEffect(() => {
const reqtoserverinstance=new ReqtoServerfun()
reqtoserverinstance.payload_response().then(payload_res=>{
  if(payload_res.status===200 || payload_res.status===201)
  {
    const {rendersigninOrnot}=payload_res.data.data
    if(rendersigninOrnot==='true')
    {
      setrendersignin(true)
      // return dispatch({type:"Render_msg",msg:true})
    }
    else if(rendersigninOrnot==='false'){
      setrendersignin(false)
      // return dispatch({type:"Render_msg",msg:false})
    }
  }
  else {
    setrendersignin(true)
  //  return dispatch({type:"Render_msg",msg:true})
  }
})


  });
  if (rendersignin!==null)
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Product {...props} />} />
          <Route exact path="/signin" render={()=><Signin render={rendersignin}/>} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </BrowserRouter>
    </div>
  );
  else if ( rendersignin===null) {
    // const styles = {
    //   display: "flex",
    //   justifyContent: "center",
    //   height: " 100vh",
    //   alignItems: "center",
    // };
    // return <Loader style={styles} type="Oval" width={80} height={40}></Loader>;
  return <div></div>
  }
}

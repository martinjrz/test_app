import React,{useEffect,useState} from 'react'
import {BrowserRouter ,Route, Switch} from 'react-router-dom'
import Product from './product/product'
import { Signin } from './signin/signin'
import { Signup } from './signup/signup'
import axios from 'axios'
export default function Index() {

const [hm_,sethm_]=useState(null)
useEffect(()=>{
    


    
})

    return (
        <BrowserRouter>
        <Switch>
            <Route exact path='/signin' component={Signin}/>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path='/home' component={Product}/>
        </Switch>
        </BrowserRouter>
    )
}

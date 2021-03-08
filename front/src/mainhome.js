import React from 'react'
import {BrowserRouter ,Route, Switch} from 'react-router-dom'
import Product from './product/product'
import { Signin } from './signin/signin'
import { Signup } from './signup/signup'
export default function Index() {
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

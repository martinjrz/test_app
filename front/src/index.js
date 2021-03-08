import React from 'react'
import ReactDOM from 'react-dom'
import Index from './mainhome'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
const App =()=>{
    return (
        <Index/>
    )
}

ReactDOM.render(
<App/>
,document.getElementById('root'))
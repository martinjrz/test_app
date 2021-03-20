import React from 'react'
import ReactDOM from 'react-dom'
import Index from './mainhome'
const App =()=>{
    return (
        <React.StrictMode>
            <Index/>
        </React.StrictMode>
    )
}

ReactDOM.render(
<App/>
,document.getElementById('root'))
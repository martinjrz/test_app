import React from 'react'

export function Name_error() {
    return (
         <p style={{opacity:'0.6',fontSize:'0.8rem'}}>
            ! enter your name
         </p>
        
    )
}


 export function Password_donot_match(){
    return (
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! password must match</p>
    )
}

export function Password_length_error() {
    return (
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! password must be at least 8 characters</p>
    )
}
export function Mobile_no_error() {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter your mobile no.</p>
    )
}
export function Re_enter_password() {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! re-enter password</p>
    )
}
export function Password_error() {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter your password</p>
    )
}
export function  Valid_no() {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter valid mobile no.</p>
    )
}
export function  Mobile_no_invalid(params) {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter valid mobile no.</p>
    )
}
export function  Mobile_no_empty(params) {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter your mobile no.</p>
    )
}
export function Password_empty(params) {
    return(
        <p style={{opacity:'0.6',fontSize:'0.8rem'}}>! enter your password</p>
    )
}
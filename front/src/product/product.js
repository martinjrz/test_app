import React, { Component } from 'react'
import {BiCartAlt} from 'react-icons/bi'
import {AiOutlineUser} from 'react-icons/ai'
import {HiMenuAlt2} from 'react-icons/hi'
import './product.css'
export default class Product extends Component {
    constructor(){
        super()
        this.state={
            cart_no:0
        }
    }
    render() {
        return (
            <div>
                <div className='h-l-1'>
                    <p className='p-l-0'><HiMenuAlt2 /></p>
                    <p className='em-l-0'></p>
                    <p className='p-l-1'><AiOutlineUser/></p>
                    <p className='p-l-2'><BiCartAlt/></p>
                    <p className='p-l-3'>{this.state.cart_no}</p>
                </div>
            </div>
        )
    }
}

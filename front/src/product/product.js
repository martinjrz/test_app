import React, { Component } from 'react'
import {BiCartAlt, BiLogOut} from 'react-icons/bi'
import {AiOutlineUser} from 'react-icons/ai'
import {HiMenuAlt2} from 'react-icons/hi'
import {AiOutlinePlus} from 'react-icons/ai'
import {AiOutlineMinus} from 'react-icons/ai'
import './product.css'
import img from './marsi.png'
import {Link} from 'react-router-dom'
import axios from 'axios'

export default class Product extends Component {


    constructor(){
        super()
        this.price=250
        this.state={
            up_cart_no:0,
            cart_no:10,
            render_page:false
        } 
    }
    reqtoserver=()=>{
        const _qe_user={
            query:`
            query{
                getmobileuser{
                    username
                    cart_value
                }
            }
            `
        }
        axios({
            url:'http://localhost:5000/graphqlserver',
            data:_qe_user,
            method:'post',
            withCredentials:true,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>{
            if(res.status===200 || res.status===201){
                this.setState({
                    render_page:true
                })
            }
        })
    }
    componentDidMount(){
    this.reqtoserver()
    }
    logout=()=>{
        
    }
    render()  {
      if(this.state.render_page)
        return (
            <div className='out-div-l'>
                <div className='h-l-1'>
                
                    <p className='p-l-0'><HiMenuAlt2 /></p>
                    <p className='em-l-0'></p>
                    <div className='l-div-1'>
                    <Link className='l-1' to='/home'>Home</Link>
                    </div>
                    <button 
                    onClick={(e)=>this.logout(e)}
                    className='l-o-1'>Logout</button>
                    <p className='p-l-1'><AiOutlineUser/></p>
                    <p className='p-l-2'><BiCartAlt/></p>
                    <p className='p-l-3'>{this.state.up_cart_no}</p>
                </div>
                <div className='ace-div-1'>
                <div className='im-r-1'>
                <div className='im-l-1'>
                    <img className='im-p-1' src={img}/>
                </div>
                <div className='ti-l-1'><p className='na-l-1'>Marsi chammal (Red rice)</p></div>
                </div>
                <div className='l-0-1'>
                <div className='p-p-o-1'>
                     <p className='p-p-1'>Price:Rs {this.price}</p>
                     </div>
                <div className='op-p-1'>
                    <div className='a-s-l-1'>
                        <AiOutlinePlus className='plux-1' />
                        {this.state.cart_no}
                        <AiOutlineMinus className='minux-1'/>
                    </div>
                    </div>
                    <div className='b-a-p-1'>
                        <button className='b-t-1'>
                            Buy now
                        </button>
                        <button className='b-t-2'>
                            Add to cart
                        </button>
                  
                </div>
                <div className='des-p'>
                  <p className='des-p-1'>
                  The highly important staple food, rice, 
                  is mainly grown in warm climates (25°C),
                   but an exposure to chilling stress is common for rice cultivated in 
                   temperate zones or at high elevations in several places. 
                   Thus Jumli Marshi is more tolerant to cold stress (4°C).
                   Marsi rice is basically for the people with diabetes.
                  </p>
              </div>
                </div>
                </div>
     {/* <div className='ret-l-1'> 
     <p className='ret-l-p-1'>
Want to be a retailer? Then fill the form 
</p>
         <div>
          <form className='fo-l-1'>
              <input className='re-in-l-2' placeholder='full name'>
              </input>
              <input className='re-in-l-2' placeholder='email/mobile_no'></input>
              <input className='re-in-l-2' placeholder='location'></input>
          </form>
         </div>
     </div> */}
             
        
            </div>
        )
        return <div></div>
    }
}

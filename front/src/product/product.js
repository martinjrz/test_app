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
import Cookie from 'universal-cookie'
import  Loader from 'react-loader-spinner'
const cookie=new Cookie()
export default class Product extends Component {


    constructor(){
        super()
        this.price=250
        this.state={
            up_cart_no:0,
            cart_no:0,
            render_page:false,
            ggormb:null
        } 
    }
// request to google user
    reqtoggleserver=(towhom)=>{
        axios({
            url:'http://localhost:5000/graphqlserver',
            data:towhom,
            method:'post',
            withCredentials:true,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>{
            if(res.status===200 || res.status===201){
                const {username}=res.data.data.getgoogleuser
                if(username==='jwt malformed'
                 || username==='invalid token'
                 || username==='jwt signature is required'
                 ||username==='invalid signature' || username==='false')
               window.location.replace('/signin')
                else {
                    this.setState({
                        render_page:true
                    })
                }
            }
        })
    }
    //request to mobile user
    reqtombleserver=(towhom)=>{
        axios({
            url:'http://localhost:5000/graphqlserver',
            data:towhom,
            method:'post',
            withCredentials:true,
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>{
            if(res.status===200 || res.status===201){
                const {username}=res.data.data.getmobileuser
                if(username==='jwt malformed'
                 || username==='invalid token'
                 || username==='jwt signature is required'
                 ||username==='invalid signature' || username==='false')
               window.location.replace('/signin')
                else {
                    this.setState({
                        render_page:true
                    })
                }
            }
        })
    }
    // when the page first render
      async  componentDidMount(){
   const mb__  =await cookie.get('mb_')
        this.setState({
            ggormb:mb__
        })
        const _qe_user1={
            query:`
            query{
                getmobileuser{
                    username
                    cart_value
                }
            }
            `
        }  
        const _qe_user2={
            query:`
            query{
                getgoogleuser{
                    username
                    cart_value
                }
            }
            `
        }
        if(!mb__)
        {
         window.location.replace('/signin')
        }
        else if(mb__)
        {
            if(this.state.ggormb==='true')
            this.reqtombleserver(_qe_user1)
            if(this.state.ggormb==='false')
            this.reqtoggleserver(_qe_user2)
        }

    }
    logout=()=>{
        const _logout={
            query:`
            query{
                logout_
            }
            `
        }
        axios({
            url:"http://localhost:5000/graphqlserver",
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true,
            data:_logout
        }).then(response=>{
            if(response.status===200 || response.status===201)
            {
                const {logout_}=response.data.data
                console.log(logout_)
                if(logout_==='verified')
                {
                 window.location.replace('/signin')
            }
            }
        })
    }

    add_to_cart=()=>{
        if(this.state.cart_no<10){
            this.setState({
                cart_no:1+this.state.cart_no
            })
        }
    }
    sub_to_cart=()=>{
        if(this.state.cart_no>0)
        {
            this.setState({
                cart_no:this.state.cart_no-1
            })
        }
       
    }
    updateCart_value(){
        this.setState({
            up_cart_no:this.state.cart_no+this.state.up_cart_no
        })
    }
    render()  {
        
      if(this.state.render_page && this.state.ggormb!==null)
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
                        <button className='b-c-l-1' onClick={()=>this.add_to_cart()}>
                        <AiOutlinePlus className='plux-1' />
                        </button>
                       <p>
                       {this.state.cart_no}
                        </p>
                        <button 
                         className='b-c-l-2'
                        onClick={()=>this.sub_to_cart()}>
                        <AiOutlineMinus  className='minux-1'/>
                        </button>
                    </div>
                    </div>
                    <div className='b-a-p-1'>
                        <button className='b-t-1'>
                            Buy now
                        </button>
                        <button onClick={()=>this.updateCart_value()} className='b-t-2'>
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
        if(!this.state.render_page)
        return <div className='loader'>
            <Loader
             type='MutatingDots'
             width={100} 
            />
        </div>
    }
}

import React, { Component } from "react";
import { BiCartAlt } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { HiMenuAlt2 } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import "./product.css";
import img from "./marsi.png";
import { Link } from "react-router-dom";
import Cookie from "universal-cookie";
import Loader from "react-loader-spinner";
import base from "../baseurl";
import { gapisetup } from "../gapiserver";
import { scriptsetup } from "../gapiserver";
const cookie = new Cookie();

export default class Product extends Component {
  constructor() {
    super();
    this.price = 250;
    this.state = {
      up_cart_no: 0,
      cart_no: 0,
      render_page: false,
      ggormb: null,
      actual_cart_value: 0,
      initialmb_state: null,
    };
  }

  // request to google user
  reqtoggleserver = (towhom) => {
    base.post("/graphqlserver", towhom).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        const { username, cart_value } = res.data.data.getgoogleuser;
        if (
          username === "jwt malformed" ||
          username === "invalid token" ||
          username === "jwt signature is required" ||
          username === "invalid signature" ||
          username === "false"
        ) {
          const script=await scriptsetup()
          script.onload=async()=>{
            const gapiserver=await gapisetup()
            const authinstance=gapiserver.auth2.getAuthInstance()
            authinstance.signOut()
            window.location.replace("/signin")
          }
         document.body.appendChild(script)   
        } else {
          await this.setState({
            render_page: true,
            up_cart_no: cart_value,
            actual_cart_value: cart_value,
          });
          this.insertgapiserver();
        }
      }
    });
  };
  // insert the gapi server
  async insertgapiserver() {
    const script = await scriptsetup();
    script.onload = async () => {
      const data = await gapisetup();
      console.log(data);
    };
    document.body.appendChild(script);
  }
  //request to mobile user
  reqtombleserver = (towhom) => {
    base.post("/graphqlserver", towhom).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        const { username,cart_value} = res.data.data.getmobileuser;
        if (
          username === "jwt malformed" ||
          username === "invalid token" ||
          username === "jwt signature is required" ||
          username === "invalid signature" ||
          username === "false"
        ) {
            const script = await scriptsetup();
            script.onload = async () => {
              const gapiserver = await gapisetup();
              const authinstance = gapiserver.auth2.getAuthInstance();
              if(authinstance.currentUser.get().getBasicProfile())
              authinstance.signOut();
              window.location.replace("/signin");
             };
            document.body.appendChild(script);
        } else {
          this.setState({
            render_page: true,
            up_cart_no: cart_value,
            actual_cart_value: cart_value,
          });
        }
      }
    });
  };

  // when the page first render
  async componentDidMount() {
    const mb__ = await cookie.get("mb_");

    await this.setState({
      ggormb: mb__,
    });
    const _qe_user1 = {
      query: `
            query{
                getmobileuser{
                    username
                    cart_value
                }
            }
            `,
    };
    const _qe_user2 = {
      query: `
            query{
                getgoogleuser{
                    username
                    cart_value
                }
            }
            `,
    };

    const signOut_Guser = async function () {
      const gapiserver = await gapisetup();
      const authinstance = gapiserver.auth2.getAuthInstance();
      authinstance.signOut();
      window.location.replace("/signin");
    };

    if (!mb__) {
      const verified_query = {
        query: `
          query{
            mb__verification
          }
          `,
      };
      const payload_mb = await base.post("/graphqlserver", verified_query);
      const mb_verification = payload_mb.data.data.mb__verification;
      console.log(payload_mb.data.data.mb__verification);
      if (mb_verification === "unverified_mb") {
          const script = await scriptsetup();
          script.onload = async () => {
            window.gapi.load("auth2", async () => {
              signOut_Guser();
            });
          };
          document.body.appendChild(script);
      }
    } else if (mb__ === "true" || mb__ === "false") {
      if (this.state.ggormb === "true") this.reqtombleserver(_qe_user1);
      if (this.state.ggormb === "false") this.reqtoggleserver(_qe_user2);
    } else {
      const verified_query = {
        query: `
          query{
            mb__verification
          }
          `,
      };
      const payload_mb = await base.post("/graphqlserver", verified_query);
      const mb_verification = payload_mb.data.data.mb__verification;
      console.log(mb_verification);
      if (mb_verification === "unverified_mb") {
        if (cookie.get("G_AUTHUSER_H")) {
          const script = await scriptsetup();
          script.onload = async () => {
            window.gapi.load("auth2", async () => {
              signOut_Guser();
            });
          };
          document.body.appendChild(script);
        } else {
          window.location.replace("/signin");
        }
      }
    }
  }

  Requestoserver = async (type_of_request) => {
    const data = await base.post("/graphqlserver", type_of_request);
    return data;
  };
  //logout user
  logout = () => {
    const _logout = {
      query: `
            query{
                logout_
            }`,
    };
    base.post("/graphqlserver", _logout).then(async (response) => {
      if (response.status === 200 || response.status === 201) {
        const { logout_ } = response.data.data;
        if (logout_ === "verified_g_auth") {
          const gapiserver = await gapisetup();
          const authinstance = gapiserver.auth2.getAuthInstance();
          authinstance.signOut();
          window.location.replace("/signin");
        } else if (logout_ === "verified_mb_auth") {
          window.location.replace("/signin");
        }
        else {
          window.location.reload()
        }
      }
    });
  };

  add_to_cart = () => {
    if (this.state.cart_no < 10) {
      this.setState({
        cart_no: 1 + this.state.cart_no,
      });
    }
  };
  sub_to_cart = () => {
    if (this.state.cart_no > 0) {
      this.setState({
        cart_no: this.state.cart_no - 1,
      });
    }
  };

  async updateCart_value() {
    await this.setState({
      up_cart_no: this.state.cart_no + this.state.up_cart_no,
    });
    const typeof_req = {
      query: `
            mutation{
                addtocarter(cn__value:${this.state.up_cart_no}){
                    cn_value
                    uV_
                }
            }
            `,
    };

    if (this.state.cart_no >= 1) {
      this.Requestoserver(typeof_req).then((responseback) => {
        if (responseback.status === 201 || responseback.status === 200) {
          const { cn_value,uV_} = responseback.data.data.addtocarter;
          if(uV_==='ok')
          {
            this.setState({
              actual_cart_value: cn_value,
            });
          }
         else if(uV_==='null')
         {
           window.location.reload()
         }
        }
      });
    }
  }
  render() {
    if (this.state.render_page && this.state.ggormb !== null)
      return (
        <div className="out-div-l">
          <div className="h-l-1">
            <p className="p-l-0">
              <HiMenuAlt2 />
            </p>
            <p className="em-l-0"></p>
            <div className="l-div-1">
              <Link className="l-1" to="/home">
                Home
              </Link>
            </div>
            <button onClick={(e) => this.logout(e)} className="l-o-1">
              Logout
            </button>
            <p className="p-l-1">
              <AiOutlineUser />
            </p>
            <p className="p-l-2">
              <BiCartAlt />
            </p>
            <p className="p-l-3">{this.state.actual_cart_value}</p>
          </div>
          <div className="ace-div-1">
            <div className="im-r-1">
              <div className="im-l-1">
                <img className="im-p-1" src={img} />
              </div>
              <div className="ti-l-1">
                <p className="na-l-1">Marsi chammal (Red rice)</p>
              </div>
            </div>
            <div className="l-0-1">
              <div className="p-p-o-1">
                <p className="p-p-1">Price:Rs {this.price}</p>
              </div>
              <div className="op-p-1">
                <div className="a-s-l-1">
                  <button
                    className="b-c-l-1"
                    onClick={() => this.add_to_cart()}
                  >
                    <AiOutlinePlus className="plux-1" />
                  </button>
                  <p>{this.state.cart_no}</p>
                  <button
                    className="b-c-l-2"
                    onClick={() => this.sub_to_cart()}
                  >
                    <AiOutlineMinus className="minux-1" />
                  </button>
                </div>
              </div>
              <div className="b-a-p-1">
                <button className="b-t-1">Buy now</button>
                <button
                  onClick={() => this.updateCart_value()}
                  className="b-t-2"
                >
                  Add to cart
                </button>
              </div>
              <div className="des-p">
                <p className="des-p-1">
                  The highly important staple food, rice, is mainly grown in
                  warm climates (25°C), but an exposure to chilling stress is
                  common for rice cultivated in temperate zones or at high
                  elevations in several places. Thus Jumli Marshi is more
                  tolerant to cold stress (4°C). Marsi rice is basically for the
                  people with diabetes.
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
      );
    else if (!this.state.render_page)
      return (
        <div className="loader">
          <Loader type="Oval" width={80} height={40} />
        </div>
      );
  }
}

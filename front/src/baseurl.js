import axios from 'axios'
 export default axios.create({
     baseURL:'http://localhost:5000',
     withCredentials:true,
     timeout:5000,
     headers:{
         'Content-Type':'application/json',
         'auth':'token'
     }
 })
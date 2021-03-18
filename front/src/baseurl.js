import axios from 'axios'
 export default axios.create({
     baseURL:'https://marsi-chammal-app.herokuapp.com/',
     withCredentials:true,
     timeout:5000,
     headers:{
         'Content-Type':'application/json',
     }
 })
import axios from 'axios'
 export default axios.create({
     baseURL:'https://marsi-chammal-red-rice-app.herokuapp.com/',
    // baseURL:'http://localhost:3000',
     withCredentials:true,
    //  timeout:10000,
     headers:{
         'Content-Type':'application/json',
     }
 })
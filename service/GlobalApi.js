import axios from "axios";


const API_KEY = import.meta.env.VITE_STRAPI_API_KEY
const axiousClient = axios.create({
    baseURL :import.meta.env.VITE_BASE_URL +"/api/",
    headers :{
        'Content-Type':'application/json',
        'Authorization':`bearer ${API_KEY}`
    }
})

const CreateNewResume =(data)=>axiousClient.post('/user-resumes',data)

export default{
    CreateNewResume
}
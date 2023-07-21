import axios from "axios";

const axiosBackend = axios.create({
    // baseURL: process.env.REACT_APP_BACKEND_URL
    baseURL: 'https://c4cc-192-228-130-202.ngrok-free.app/api'
})

export default axiosBackend
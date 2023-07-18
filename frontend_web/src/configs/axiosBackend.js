import axios from "axios";

const axiosBackend = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
})

export default axiosBackend
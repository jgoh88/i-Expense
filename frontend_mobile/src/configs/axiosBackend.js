import axios from "axios";

const axiosBackend = axios.create({
    baseURL: 'https://i-expense.onrender.com/api'
})

export default axiosBackend
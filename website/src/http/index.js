import axios from "axios";





export const state = {
    jwt:""
}

// 初始化尝试从localStorage中获取jwt
state.jwt = localStorage.getItem("jwt")




const http = axios.create({})


// Add a request interceptor
http.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${state.jwt}`
    return config;
})

export default http;
import axios from "../axios";

export const apiLogin = (credentials) =>axios({
    url:'/user/login',
    method:'post',
    data:credentials
})
export const apiRefreshToken = () =>axios({
    url:'/user/refreshaccesstoken',
    method:'post'
})

export const apiRegister = (register) =>axios({
    url:'/user/register',
    method:'post',
    data:register
})
export const apiFinalRegister = (token) =>axios({
    url: `/user/finalregister/${token}`, // Thêm token vào URL
    method: 'get'
})

export const apiForgotPassword = (email)=>axios({
    url:'/user/forgotpassword',
    method:'post',
    data:email
})

export const apiResetPassword = (token,password)=>axios({
    url:`/user/resetpassword/${token}`,
    method:'put',
    data:{password}
})

export const apiGetCurrent = () =>axios({
    url:'/user/current',
    method:'get',
})
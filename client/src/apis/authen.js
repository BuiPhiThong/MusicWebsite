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

export const apiGetCurrent = () =>axios({
    url:'/user/current',
    method:'get',
})
import axios from "../axios";

export const apiLogin = (credentials) =>axios({
    url:'/user/login',
    method:'post',
    data:credentials
})
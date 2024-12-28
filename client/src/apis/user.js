import axios from "../axios";

export const apiUpandReWishList= (sid,wid)=>axios({
    url:`/user/updatewishlist/${sid}`,
    method:'put',
    data:{wid}
})

export const apiCreateWishList= (sid,data)=>axios({
    url:`/user/createwislist/${sid}`,
    method:'post',
    data:data
})
import axios from "../axios";

export const apiWishList= (sid,wid)=>axios({
    url:`/user/updatewishlist/${sid}`,
    method:'put',
    data:{wid}
})
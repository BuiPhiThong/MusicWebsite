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

export const apiSaveAPlaylist= (slug)=>axios({
    url:`/user/saveplaylist/${slug}`,
    method:'post',
})

export const apiSaveAPlaylist2= (slug,name)=>axios({
    url:`/user/saveplaylist2/${slug}`,
    method:'post',
    data:{name}
})

export const apiUpdateProfile=(formdata)=>axios({
    url:'/user/',
    method:'put',
    data:formdata
})
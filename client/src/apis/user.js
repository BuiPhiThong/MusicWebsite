import axios from "../axios";

export const apiUpandReWishList= (sid,wid)=>axios({
    url:`/user/updatewishlist/${sid}`,
    method:'put',
    data:{wid}
})

export const apiCreateWishList= (sid,data)=>axios({
    url: sid ? `/user/createwislist/${sid}` : `/user/createwislist`, // Không thêm `sid` nếu không được truyền
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

export const apiDeleteWishlist= (wid)=>axios({
    url:`/user/deletedwishlist/${wid}`,
    method:'put'
})

export const apiDeleteAllWishlist= ()=>axios({
    url:`/user/deletedallwishlist`,
    method:'delete'
})


export const apiUpdateProfile=(formdata)=>axios({
    url:'/user/',
    method:'put',
    data:formdata
})

export const apiChangePassword=(data)=>axios({
    url:'/user/changepassword',
    method:'put',
    data:data
})
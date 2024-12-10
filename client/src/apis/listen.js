import axios from "../axios";

export const apiGetListenSong = (plid) => axios({
    url:`/playlist/listenplaylist/${plid}`,
    method:'get'
})
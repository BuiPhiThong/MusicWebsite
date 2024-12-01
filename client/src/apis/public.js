import axios from "../axios";

export const apiGetModule = (tid) => axios({
    url: `/playlist/${tid}`,
    method: 'get',
  });


export const apiGetTop10SongsByCountry = (cid) =>axios({
  url:`/song/top10/${cid}`,
  method:'get'
})

export const apiGetTop3Country = () => axios({
  url:'/country/top3',
  method:'get'
})

export const apiGetTop1SongsByCountry = (cid) =>axios({
  url:`/song/topone/${cid}`,
  method:'get'
})
export const apiGetTop2SongsByCountry = (cid) =>axios({
  url:`/song/toptwo/${cid}`,
  method:'get'
})
export const apiGetTop3SongsByCountry = (cid) =>axios({
  url:`/song/topthree/${cid}`,
  method:'get'
})
export const apiGetTop4to10SongsByCountry = (cid) =>axios({
  url:`/song/top4to10/${cid}`,
  method:'get'
})

export const apiPopupSearch = (textSearch)=> axios({
  url:`/song/homesearch/?textSearch=${textSearch}`,
  method:'get'
})
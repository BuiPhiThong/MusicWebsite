import axios from "../axios";

export const apiGetDataSearchAll= (text) => axios({
    url : `/homesearch/?all=${text}`,
    method:'get'
})
// export const apiGetDataSongSearch= (text) => axios({
//     url : `/homesearch/bai-hat/?song=${text}`,
//     method:'get'
// })
export const apiGetDataSongSearch = (text, page, limit) => axios({
    url: `/homesearch/bai-hat/?song=${text}&page=${page}&limit=${limit}`,
    method: 'get',
});

export const apiGetDataSingerSearch= (text) => axios({
    url : `/homesearch/ca-sy/?singer=${text}`,
    method:'get'
})

export const apiGetDataPlaylistSearch= (text) => axios({
    url : `/homesearch/danh-sach/?playlist=${text}`,
    method:'get'
})



// export const apiGetDataSingerSearch = (text, page = 1, limit = 9) => axios({
//     url: `/homesearch/ca-sy/?singer=${text}&page=${page}&limit=${limit}`,
//     method: 'get',
// });

// export const apiGetDataPlaylistSearch = (text, page = 1, limit = 9) => axios({
//     url: `/homesearch/danh-sach/?playlist=${text}&page=${page}&limit=${limit}`,
//     method: 'get',
// });
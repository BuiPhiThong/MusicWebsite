import axios from "../axios";

export const apiGetItemOne = () => axios({
    url: '/playlist',
    method: 'get',
  });


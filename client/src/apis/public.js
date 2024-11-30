import axios from "../axios";

export const apiGetModule = (tid) => axios({
    url: `/playlist/${tid}`,
    method: 'get',
  });


/**
 * baseURL이 반복되어 사용되기 때문에
 * 이곳에서 axios 객체를 생성하여 각 사용 vue에서 import해주고,
 * baseURL은 이곳에서 정의한대로 사용하도록 한다.
 */

import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000/'
});
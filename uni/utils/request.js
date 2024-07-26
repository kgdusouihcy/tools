import { getToken } from "@/utils/auth"
import toast from "@/utils/toast"

// #ifdef H5
const base = ''
// #endif
// #ifndef H5
const base = import.meta.env.VITE_BASE_URL
// #endif

const timeout = 1000 * 10
// 请求拦截器
const request = config => {
  const token = getToken()
  config.header = config.header || {}
  token && (config.header.token = token);
  if (config.method === "POST" && config.isForm) {
    config.header["content-type"] = "application/x-www-form-urlencoded";
  }
  return new Promise((resolve, reject) => {
    // 请求拦截器
    uni.request({
      ...config,
      url: base + config.url,
      timeout,
      dataType: "json",
      success: res => {
        response(res, resolve, reject);
      },
      fail: err => {
        console.log(err);
        toast.error('请求错误', () => reject(err))
      },
    });
  });
};
// 响应拦截器
const response = (response, resolve, reject) => {
  if (response.statusCode !== 200) {
    const res = response.data || response
    res.msg = res.msg || res.message || '请求错误'
    reject(res)
    return
  }
  if (Array.isArray(response.data)) {
    response.data = { data: response.data, code: 200 }
  }
  // 响应拦截器
  if (!response.data.code || response.data.code !== 200) {
    // 登录超时,重新登录
    if (response.data.msg === '凭证失效，请重新登录') {
      toast(response.data.msg, () => uni.reLaunch({ url: "/pages/login" }))
      return reject(response.data);
    }
    if (response.data.message === "凭证不能为空") {
      uni.reLaunch({ url: "/pages/login", })
      return reject(response.data);
    }
    if (!response.data.msg) {
      response.data.msg = response.data.message
    }
    return reject(response.data);
  }
  return resolve(response.data);
};
request.get = (url, data) => request({ url, method: "GET", data });

request.post = (url, data, config = {}) => request({ url, method: "POST", data, isForm: true, ...config });

request.upload = (url, { formData = {}, files = [] }) => {
  if (!files.length) {
    return request.post(url, formData)
  }
  const token = getToken()
  const header = {};
  token && (header.token = token);
  return new Promise((resolve, reject) => {
    // 请求拦截器
    uni.uploadFile({
      url: base + url,
      files,
      formData,
      header,
      timeout,
      success: res => {
        if (typeof res.data === 'string') res.data = JSON.parse(res.data);
        response(res, resolve, reject);
      },
      fail: err => {
        toast.error('请求错误', () => reject(err))
      },
    });
  });
};

export default request
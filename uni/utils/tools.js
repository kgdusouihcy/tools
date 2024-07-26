import toast from "@/utils/toast"
import commonApi from "@/api/common"
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))
const windowHeight = uni.getSystemInfoSync().windowHeight
export default {
  sleep,
  // 日期加操作
  addDate(date, number, type) {
    switch (type) {
      case 'day':
        return new Date(date.getTime() + number * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(date.getFullYear(), date.getMonth() + number, date.getDate())
      case 'year':
        return new Date(date.getFullYear() + number, date.getMonth(), date.getDate())
      default:
        return date
    }
  },
  dateToString(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  },
  getCodeByUrl(url) {
    const re = {}
    re.type = url.startsWith('http') ? 'code' : 'rfidNumber'
    re[re.type] = url.startsWith('http') ? url.split('=').pop() : url
    return re
  },
  async loadingRequest({ request, message = '提交', success, fail }) {
    try {
      toast.showLoading(`${message}中`)
      const res = await request()
      toast.success(`${message}成功`, () => {
        success && success(res)
      })
      return Promise.resolve(res)
    } catch (e) {
      toast(e.msg, () => { fail && fail(e) })
      return Promise.reject(e)
    } finally {
      toast.hideLoading()
    }
  },
  async getBottleInfoByCode(code) {
    try {
      toast.showLoading(`查询中`)
      const label = await commonApi.getRfidByCode(code).then(res => res.rfidNumber)
      const res = await commonApi.getLiquefactionByLabel(label)
      return res
    } catch (e) {
      toast(e.msg)
      return {}
    } finally {
      toast.hideLoading()
    }
  },
  previewImage(current, urls) {
    uni.previewImage({ current, urls })
  }
}
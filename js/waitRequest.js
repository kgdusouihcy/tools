const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))
export default async function waitRequest({ request, toast, showLoading, hideLoading, message = '提交', duration = 1500, success, fail }) {
  try {
    showLoading(message)
    const res = await request()
    toast(`${message}成功`)
    await sleep(duration)
    success && success(res)
    return res
  } catch (e) {
    toast(e.msg || '请求失败')
    await sleep(duration)
    fail && fail(e)
    return e
  } finally {
    hideLoading()
  }
}
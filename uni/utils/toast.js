const sleep = (time) => new Promise(resolve => setTimeout(resolve, time))

function commonToast({ title, onClose, duration = 1500, icon = 'none', mask = true }) {
  uni.showToast({
    mask,
    title,
    icon,
    duration,
    async success() {
      await sleep(duration)
      onClose && onClose()
    }
  })
}

function toast(config, onClose, icon = 'none') {
  const option = typeof config === "object" ? { ...config, icon } : { title: config, icon }
  if (typeof config !== "object" && onClose) option.onClose = onClose
  commonToast(option)
}
toast.showLoading = title => uni.showLoading({ title })
toast.hideLoading = uni.hideLoading
const types = ['success', 'error', 'fail', 'exception']
types.forEach(icon => {
  toast[icon] = (config, onClose) => {
    toast(config, onClose, icon)
  }
})

export default toast
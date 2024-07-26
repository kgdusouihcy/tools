import { defineStore } from 'pinia';
import { onMounted, ref } from "vue"
import userApi from "@/api/user"
import { setToken, setUserRole, ROLES } from "@/utils/auth";
import tools from '@/utils/tools';
import toast from "@/utils/toast"

export const useUserStore = defineStore('user', () => {
  const count = ref(60)
  const isSend = ref(false)
  const token = ref('')
  const userRole = ref(0)
  const userInfo = ref({
    userName: '',
    deptName: ''
  })
  const setUserInfo = info => {
    userInfo.value = info
    uni.setStorageSync('userInfo', JSON.stringify(info))
  }
  // 使用setTimeout倒计时
  const countDown = () => {
    if (count.value <= 0) {
      count.value = 60
      isSend.value = false
      return
    }
    count.value--
    setTimeout(countDown, 1000)
  }
  const start = () => {
    isSend.value = true
    countDown()
  }
  const send = phone => {
    if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(phone)) return toast("请输入正确的手机号！")
    userApi.getCode({ phone }).then((res) => {
      if (res.code === 200) {
        toast("短信发送成功")
        start()
      } else {
        toast(res.msg || "请求错误")
      }
    })
  }
  const login = form => {
    const loginApi = form.code ? 'phoneLogin' : 'login'
    tools.loadingRequest({
      request: () => userApi[loginApi](form),
      message: '登陆',
      success(res) {
        token.value = res.token
        setUserInfo({ userName: res.userName, deptName: res.deptName })
        setToken(res.token)
        for (const role in ROLES) {
          if (res[role]) userRole.value |= ROLES[role]
        }
        setUserRole(userRole.value)
        uni.reLaunch({ url: '/pages/index' })
      }
    })
  }
  const logOut = () => {
    setUserInfo({})
    token.value = ''
    userRole.value = 0
    uni.clearStorage()
    uni.reLaunch({ url: "/pages/login" })
  }
  const changePwd = async (form) => {
    tools.loadingRequest({
      request: () => userApi.changePwd(form),
      message: '修改密码',
      success: logOut
    })
  }
  const checkLogin = () => {
    if (userRole.value == 0) {
      toast('身份过期，请重新登录', logOut)
    }
  }
  onMounted(() => {
    userInfo.value = JSON.parse(uni.getStorageSync('userInfo') || "{}")
    userRole.value = uni.getStorageSync('userRole')
    token.value = uni.getStorageSync('token')
  })
  return { login, send, count, isSend, logOut, changePwd, userInfo, checkLogin }
});
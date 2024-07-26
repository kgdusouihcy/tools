import { reactive, ref } from 'vue';
export default function({ request, getData, initQuery = {} }) {
  const status = ref('more')
  const list = ref([])
  const query = reactive({
    current: 1,
    limit: 10,
    ...initQuery
  })
  const getList = async () => {
    if (status.value === 'nomore' || status.value === 'loading') return
    try {
      status.value = 'loading'
      const res = await request(query)
      const data = getData(res)
      list.value.push(...data)
      if (!data.length) {
        status.value = 'nomore'
      } else {
        status.value = 'more'
        query.current++
      }
    } catch (e) {
      status.value = 'nomore'
    } finally {
      uni.stopPullDownRefresh()
    }
  }
  const reLoad = () => {
    query.current = 1
    status.value = 'more'
    list.value = []
    getList()
  }
  return { status, list, query, getList, reLoad }
}
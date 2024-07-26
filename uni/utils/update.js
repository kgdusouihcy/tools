import commenApi from "@/api/common"
import toast from "./toast";
async function update() {
  const { appVersion: version, platform } = uni.getSystemInfoSync()
  const { download, update } = await commenApi.check_version({ platform, version });
  if (update) {
    uni.showModal({
      title: "提示",
      content: "检测到了新版本，是否进入下载？",
      confirmText: "下载新版本",
      confirmColor: "#1989fa",
      succes(res) {
        if (res.confirm) {
          //确认下载开始下载apk
          toast.showLoading("下载中...（请勿切换至后台）");
          const filename = "_downloads" + download.split("/").pop();
          const task = plus.downloader.createDownload(
            download, { filename },
            function(_, status) {
              toast.hideLoading()
              if (status == 200) {
                plus.runtime.openFile(filename);
              } else {
                toast.error("下载失败: " + status)
              }
            }
          );
          task.start();
        } else if (res.cancel) {
          //取消下载直接退出应用
          plus.runtime.quit();
        }
      }
    })
  }
}
export default update;
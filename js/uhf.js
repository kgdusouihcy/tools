class Uhf {
  instance = null;
  inductionItem = null;
  constructor() { }
  static getInstance() {
    return this.instance ? this.instance : new Uhf();
  }
  // 进行感应环节
  start(inductionItem) {
    this.inductionItem = inductionItem;
    const that = this;
    let flag = false;
    this.inductionItem.loadingText = "初始化，打开设备";

    if (typeof plus === "undefined") {
      this.inductionItem.loadingText =
        "未知错误，请检查是否有安装感应APP或该机型是否有感应功能";
      return (this.inductionItem.iconShow = "error");
    }
    const main = plus.android.runtimeMainActivity();
    if (!this.inductionItem.isRegister) {
      const IntentFilter = plus.android.importClass(
        "android.content.IntentFilter"
      );
      const filter = new IntentFilter();
      filter.addAction("com.p9uhf.card.epc");
      filter.addAction("com.p9uhf.result");
      this.inductionItem.receiver = plus.android.implements(
        "io.dcloud.feature.internal.reflect.BroadcastReceiver",
        {
          onReceive: function (context, intent) {
            //实现onReceiver回调函数
            const action = intent.getAction();
            flag = true;
            switch (action) {
              case "com.p9uhf.card.epc":
                that._success(intent)
                break;
              case "com.p9uhf.result":
                /**
                 * -1未知错误
                 * 0成功
                 * 1连接失败
                 * 2未连接
                 * 3已连接
                 * 4开始读卡失败
                 * 5正在读卡
                 * 6未读卡
                 * 7停止失败
                 * @param result
                 */
                const result = intent.getIntExtra("result", -1);
                if (result == -1) {
                  that.inductionItem.iconShow = "error";
                  that.inductionItem.loadingText = "未知错误，请检查是否有安装感应APP或该机型是否有感应功能";
                }
                break
              default:
                break
            }
            if (action === "com.p9uhf.card.epc") {
            }
          }
        }
      );
      main.registerReceiver(that.inductionItem.receiver, filter); //注册监听
      this.inductionItem.isRegister = true;

      //发送打开模块的广播
      this.sendBroadcast("com.p9uhf.open");
      setTimeout(() => {
        this.inductionItem.loadingText = "设置功率中...";
        this.sendBroadcast("com.p9uhf.set.power", 25);
      }, 1000);
      setTimeout(() => {
        this.inductionItem.loadingText = "开始读卡，请将手持机挨近电子标签";
        this.inductionItem.iconShow = "loading";
        this.sendBroadcast("com.p9uhf.start.read");
      }, 2000);
      setTimeout(() => {
        if (!flag) {
          this.inductionItem.loadingText =
            "未知错误，请将设备靠近标签，或检查是否有安装感应APP或该机型是否有感应功能";
          this.inductionItem.iconShow = "error";
        }
      }, 15000);
    }
  }
  // 识别成功
  _success(intent) {
    // 读取到标签时的回调
    const epc = intent.getStringExtra("epc");
    // 是否只读取一个标签
    if (this.inductionItem.single) {
      this.inductionItem.epc = epc;
      this.inductionItem.loadingText = `已读取成功`;
      this.inductionItem.iconShow = "success";
      // 读取到标签后立即停止再读取
      this.close();
      return
    }
    if (!this.inductionItem.epcList.includes(epc)) {
      this.inductionItem.epcList.push(epc);
      // 读取到标签数等于max后立即停止读取
      if (this.inductionItem.max && this.inductionItem.epcList.length >= this.inductionItem.max) {
        this.close();
      }
    }
    this.inductionItem.loadingText = `已读取到${this.inductionItem.epcList.length}个标签`;
  }
  //发送关闭模块的广播
  close() {
    this.inductionItem.show = false
    this.sendBroadcast("com.p9uhf.stop.read");
    this.sendBroadcast("com.p9uhf.close");
  }
  // 感应设置
  sendBroadcast(action, power = -1) {
    const main = plus.android.runtimeMainActivity();
    const Intent = plus.android.importClass("android.content.Intent");
    const ComponentName = plus.android.importClass(
      "android.content.ComponentName"
    );
    const intent = new Intent();
    const componnentName = new ComponentName(
      "com.android.p9uhfhelpservice",
      "com.android.p9uhfhelpservice.receive.UhfReceiver"
    );
    intent.setAction(action);
    if (power != -1) {
      intent.putExtra("power", power);
    }
    intent.setComponent(componnentName);
    main.sendBroadcast(intent);
  }
  stop() {
    this.sendBroadcast("com.p9uhf.stop.read");
  }
}
export default Uhf.getInstance();

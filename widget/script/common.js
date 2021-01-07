

apiready = function() {

	if(api.systemType == 'android'){

		var leCastDemo = null;
		var uid1 = "";
		var uzmoduledemo = null;
		var TVURL = "";
	}
}

//搜索设备
function browse() {
  leCastDemo = api.require('leCast');
  leCastDemo.initLeCast(); //模块初始化方法，必须在所有方法调用前调用

    api.showProgress({
        title: '搜索设备中……',
        text: '请稍等...',
        modal: true
    });
    //var param = {browseType:1};
    var param = {
        browseType: 0
    };
    leCastDemo.browse(param, function(ret, err) {
        if (ret.result == '1') {
            //alert(JSON.stringify(ret));
            console.log(JSON.stringify(ret));
            var arr = [];
            var deviceList = ret.deviceList;
            for (var i = 0; i < ret.deviceList.length; i++) {
                arr.push(ret.deviceList[i]["name"]);
            }
            console.log('Arr=' + arr);
            if (arr.length > 0) {
                api.actionSheet({
                    title: '请选择接收设备',
                    cancelTitle: '取消',
                    buttons: arr
                }, function(ret, err) {
                    var index = ret.buttonIndex;
                    uid1 = deviceList[index - 1]['ip'];
                    stopBrowse(); //停止搜索方法
                    connect(); //链接设备
                });
            } else {

                api.hideProgress();
                api.toast({
                    msg: '未搜索到其他设备',
                    duration: 1000
                });
            }
            api.hideProgress();
        }


    });
}
//停止搜索附近的接收端设备
function stopBrowse() {

    leCastDemo = api.require('leCast');
    leCastDemo.stopBrowse(function(ret, err) {
        //alert(JSON.stringify(ret));
    });
}
//通过uid连接,在browse回调中获取搜索到的uid
function connect() {

    leCastDemo = api.require('leCast');
    //var param = {serviceInfoUid: uid1}; //传入uid  1474652758755455217
    var param = {
        serviceInfoIp: uid1
    }; //传入Ip
    leCastDemo.connect(param, function(ret, err) {
        //alert(JSON.stringify(ret));
        if (ret) {
            stopBrowse();
            //startMirror();
            play();
        }
    });
}
//播放媒体
function play() {

    leCastDemo = api.require('leCast');
    //var wd = $api.val($api.byId('url1'));
    //console.log(wd);
    var param = {
        directPlay: 0, //是否直接播放，1无需连接设备直接播放(但需要先搜索)，0需连接设备(默认)
        connectedUid: uid1, //直接播放的设备的uid(需要先搜索获取)，directPlay为1时该字段必须要传
        screenCode: "", //有些屏幕需要投屏码的就要传，可选项
        mediaType: 2, //媒体类型：数字型，1音乐,2视频，3图片
        localUrl: "", //本地媒体路径，支持widget://,fs://,安卓系统标准文件路径
        netUrl: TVURL, //网络文件路径,http://...
        //这两个url必须要传一个，两个都传时只认localUrl
    };
    leCastDemo.play(param, function(ret, err) {
        if (ret.status != 25) { //播放进度已更新不弹窗，避免弹窗过多
            //alert(JSON.stringify(ret));
            //var msg = JSON.stringify(ret.msg);
            api.toast({
                msg: '开始播放',
                duration: 1000
            });

            var dlna = $api.byId('dlna');
            dlna.style = "display:none";
        }

    });
}
/*搜索页面的投屏方法*/
function seacrh_TV(dataurl) {
  uzmoduledemo = api.require('androidBrowser');
  var dataurl=dataurl;
    var param = {
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight + 50,
            w: 1,
            h: 1,
        }, //w,h等于0代表横向满屏和纵向满屏
        name: "TV_frame",
        fixedOn: "", //浏览器依附在哪个window,不传或传空 为 当前Window，默认当前当前Window
        fixed: true, //浏览器是否随frame或Window滑动，默认当前当前true
        url: dataurl, //要加载的url,可选项
        browserBg: "#F0F0F0", //可选
        timeout: 7, //超时时间,指加载页面完毕后等待多少秒，超过这个时间还没收到视频地址，则认为解析视频地址失败。默认7秒

    };
    uzmoduledemo.openView(param, function(ret, err) {
        console.log(JSON.stringify(ret));
        if (ret.result == '1') {
            TVURL = ret.VideoUrl;
            var dlna = $api.byId('dlna');
            dlna.style = "display:block";
            uzmoduledemo.closeView(function(ret, err){
              //alert(JSON.stringify(ret));
            });
        }


    });


}

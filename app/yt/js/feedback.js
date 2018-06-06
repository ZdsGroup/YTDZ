(function() {
	var index = 1;
	var size = null;
	var imageIndexIdNum = 0;
	var starIndex = 0;
	var feedback = {
		question: document.getElementById('question'),
		imageList: document.getElementById('image-list'),
		submitBtn: document.getElementById('submit')
	};
	var userId = 1;
	var url = 'http:/218.87.176.150:80/oracle/comments/add';
	//	var url = 'http://182.92.2.91:8081/oracle/comments/add';
	var newUrlAfterCompress = '';
	feedback.files = [];
	feedback.uploader = null;
	feedback.deviceInfo = null;
	mui.plusReady(function() {
		//设备信息，无需修改
		feedback.deviceInfo = {
			appid: plus.runtime.appid,
			imei: plus.device.imei, //设备标识
			images: feedback.files, //图片文件
			p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os: mui.os.version,
			net: '' + plus.networkinfo.getCurrentType()
		}
	});
	/**
	 *提交成功之后，恢复表单项 
	 */
	feedback.clearForm = function() {
		feedback.question.value = '';
		feedback.imageList.innerHTML = '';
		feedback.newPlaceholder();
		feedback.files = [];
		index = 0;
		size = 0;
		imageIndexIdNum = 0;
		starIndex = 0;
		//清除所有星标
		mui('.icons i').each(function(index, element) {
			if(element.classList.contains('mui-icon-star-filled')) {
				element.classList.add('mui-icon-star')
				element.classList.remove('mui-icon-star-filled')
			}
		})
	};
	feedback.getFileInputArray = function() {
		return [].slice.call(feedback.imageList.querySelectorAll('.file'));
	};
	feedback.addFile = function(path) {
		feedback.files.push({
			name: "images" + index,
			path: path,
			id: "img-" + index
		});
		index++;
	};
	/**
	 * 初始化图片域占位
	 */
	feedback.newPlaceholder = function() {
		var fileInputArray = feedback.getFileInputArray();
		if(fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		};
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		var up = document.createElement("div");
		up.setAttribute('class', 'image-up')
		//删除图片
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.id = "img-" + index;

		var page = null;
		page = {
			imgUp: function() {
				var m = this;
				plus.nativeUI.actionSheet({
					cancel: "取消",
					buttons: [{
							title: "拍照"
						},
						{
							title: "从相册中选择"
						}
					]
				}, function(e) { //1 是拍照  2 从相册中选择  
					switch(e.index) {
						case 1:
							appendByCamera();
							break;
						case 2:
							appendByGallery();
							break;
					}
				});
			}
		}

		//小X的点击事件
		closeButton.addEventListener('tap', function(event) {
			setTimeout(function() {
				for(var temp = 0; temp < feedback.files.length; temp++) {
					if(feedback.files[temp].id == closeButton.id) {
						feedback.files.splice(temp, 1);
					}
				}
				feedback.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);

		function appendByCamera() {
			plus.camera.getCamera().captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var path = entry.toLocalURL();
					placeholder.classList.remove('space');
					var dstname = "_downloads/" + getUid() + ".jpg"; //设置压缩后图片的路径  
					newUrlAfterCompress = compressImage(path, dstname);
					feedback.addFile(dstname);
					feedback.newPlaceholder();
					up.classList.remove('image-up');
					placeholder.style.backgroundImage = 'url(' + path + ')';

				}, function(e) {
					mui.toast("读取拍照文件错误：" + e.message);
				});

			})
		}

		function compressImage(src, dstname) {
			//var dstname="_downloads/"+getUid()+".jpg";  
			plus.zip.compressImage({
					src: src,
					dst: dstname,
					overwrite: true,
					quality: 20
				},
				function(event) {
					//console.log("Compress success:"+event.target);  
					return event.target;
				},
				function(error) {
					console.log(error);
					return src;
					//alert("Compress error!");  
				});

		}

		// 产生一个随机数  
		function getUid() {
			return Math.floor(Math.random() * 100000000 + 10000000).toString();
		}

		function appendByGallery() {
			plus.gallery.pick(function(path) {
				var dstname = "_downloads/" + getUid() + ".jpg"; //设置压缩后图片的路径  
				newUrlAfterCompress = compressImage(path, dstname);
				placeholder.classList.remove('space');
				feedback.addFile(dstname);
				feedback.newPlaceholder();
				up.classList.remove('image-up');
				placeholder.style.backgroundImage = 'url(' + path + ')';
			})
		}
		//
		var fileInput = document.createElement('div');
		fileInput.setAttribute('class', 'file');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('tap', function(event) {
			var self = this;
			var index = (this.id).substr(-1);
			page.imgUp();
			// 拍照添加文件
		}, false);

		placeholder.appendChild(closeButton);
		placeholder.appendChild(up);
		placeholder.appendChild(fileInput);
		feedback.imageList.appendChild(placeholder);
		feedback.newPlaceholder();
	}
	feedback.newPlaceholder();
	feedback.submitBtn.addEventListener('tap', function(event) {
		 var indexWebView = plus.webview.getLaunchWebview();
		 indexWebView.evalJS("initComentList()");
		//判断网络连接
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			return mui.toast("连接网络失败，请稍后再试");
		}
		feedback.send();
	}, false);


	feedback.send = function() {
		feedback.uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
			plus.nativeUI.closeWaiting()
			if(status == 200) {
				var data = mui.parseJSON(upload.responseText);
				//上传成功，重置表单
				if(data.code == 0) {
					//调用index页面，更新群测群防列表数据
					var indexWebView = plus.webview.getLaunchWebview();
                    indexWebView.evalJS("initComentList()");
					mui.toast('反馈成功');
					feedback.clearForm();
					mui.back();
				} else {
					mui.toast("上传失败");
				}
			} else {
				mui.toast("上传失败");
			}
		});
		//添加设备ID
		feedback.uploader.addData("deviceid", selectJCSB.toString());
		//添加设备经纬度坐标
		var lng = document.getElementById('lng');
		var lat = document.getElementById('lat');
		feedback.uploader.addData("longitude", lng.value);
		feedback.uploader.addData("latitude", lat.value);
		//问题
		var question = document.getElementById('question');
		feedback.uploader.addData("content", question.value);
		//user ID 
		feedback.uploader.addData("userid", userId.toString());

		//quakeid 
		var quakeid = currentdzd.quakeid;
		feedback.uploader.addData("quakeid", quakeid.toString());

		var contact = document.getElementById('contact');
		feedback.uploader.addData("contact", contact.value);

		//添加上传文件
		mui.each(feedback.files, function(index, element) {
			var f = feedback.files[index];
			feedback.uploader.addFile(f.path, {
				key: f.name
			});
		});
		//开始上传任务
		feedback.uploader.start();
		plus.nativeUI.showWaiting();
	};

})();
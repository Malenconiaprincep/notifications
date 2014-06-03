// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "webkitNotifications.requestPermission" beforehand).
*/
function show() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var url = 'http://www.douban.com/j/search?q=%E7%94%B5%E5%BD%B1&start=1&cat=1002&cb=1';
  ajax(url,function(data){
    var data = JSON.parse(data);

    for(var i=0; i<data.items.length;i++)
    {
      if(i==5)
      {
        break;
      }
      var title = data.items[i].match(/<span class="subject-cast">.+/)[0];
      var content = data.items[i].match(/<p>.+/)[0];
      var notification = window.webkitNotifications.createNotification(
      data.items[i].match(/<img.+?>/)[0].match(/[http]+.+jpg/)[0],                      // The image.
      title.slice(27,title.length-7), // The title.
      content.slice(3,content.length-4)      // The body.
      );
      notification.show();
    }
  });

  
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

function ajax(url, fnSucc, fnFaild){
    //1.创建对象
    var oAjax = null;
    if(window.XMLHttpRequest){
        oAjax = new XMLHttpRequest();
    }else{
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }
      
    //2.连接服务器  
    oAjax.open('GET', url, true);   //open(方法, url, 是否异步)
      
    //3.发送请求  
    oAjax.send();
      
    //4.接收返回
    oAjax.onreadystatechange = function(){  //OnReadyStateChange事件
        if(oAjax.readyState == 4){  //4为完成
            if(oAjax.status == 200){    //200为成功
                fnSucc(oAjax.responseText) 
            }else{
                if(fnFaild){
                    fnFaild();
                }
            }
        }
    };
}

// Test for notification support.
if (window.webkitNotifications) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { show(); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      show();
      interval = 0;
    }
  }, 240000);
}

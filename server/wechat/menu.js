//用来存放微信菜单的配置项
export default {
    "button":[
        {	
             "type":"click",
             "name":"今日歌曲",
             "key":"V1001_TODAY_MUSIC"
         },
         {
              "name":"菜单",
              "sub_button":[
              {	
                  "type":"view",
                  "name":"搜索",
                  "url":"http://www.soso.com/"
               },
               {
								"type": "pic_sysphoto", 
								"name": "系统拍照发图", 
								"key": "rselfmenu_1_0", 
						 },{
							"type": "scancode_waitmsg", 
							"name": "扫码带提示", 
							"key": "rselfmenu_0_0", 
					},{
							"name": "发送位置", 
							"type": "location_select", 
							"key": "rselfmenu_2_0"
					},

            //    {
            //         "type":"miniprogram",
            //         "name":"wxa",
            //         "url":"http://mp.weixin.qq.com",
            //         "appid":"wx286b93c14bbf93aa",
            //         "pagepath":"pages/lunar/index"
            //     },
               {
                  "type":"click",
                  "name":"赞一下我们",
                  "key":"V1001_GOOD"
               }]
          }]
}
  
// export default {
//     button:[
//         {
//             'name':'权游周边',
//             'sub_button':[{
//                     'name':'小程序',
//                     'type':'click',
//                     'key':'mini_clicked'
//                 },{
//                     'name':'勾搭我',
//                     'type':'click',
//                     'key':'contact'
//                 },{
//                     'name':'小程序',
//                     'type':'click',
//                     'key':'mini_clicked2'
//                 },{
//                     'name':'手办',
//                     'type':'click',
//                     'key':'gitf'
//                 }
//             ]
//         },
//         {
//             'name':'最新资源',
//             'type':'location_selext',
//             'key':'location'
//         }
//     ]
// }



// export default {
//     button:[
        
//     ]
// }

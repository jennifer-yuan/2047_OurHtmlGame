$(document).ready(function(){
    const jsonData = {
        //我们的头像的位置
        "head-img":"./images/test-head-img.jpg",
        //左侧的对话列表
        "contactors":[
            //数组，每一个代表一个联系人
            {
                //名字
                "name":"李华",
                //头像图片位置
                "head_img":"./images/test-head-img-2.jpg",
                //所有消息
                "messages":[
                    {
                        //谁发的消息 0-我，1-对方
                        "who":0,
                        "msg":"我想你了",
                        //时间 目前支持 字符串形式的now:现在 和 数字形式的时间
                        "time":"now"
                    },
                    {
                        "who":1,
                        "msg":"那你就想吧！",
                        "time":"now"
                    },
                    {
                        "who":1,
                        "msg":"哈哈哈!",
                        "time":"now"
                    }
                ]
            },
            {
                "name":"张明",
                "head_img":"./images/test-head-img-3.jpg",
                "messages":[
                    {
                        "who":0,
                        "msg":"我在寻找一条路，一条通向你心里的路",
                        "time":1604240986996
                    },
                    {
                        "who":1,
                        "msg":"不好意思",
                        "time":1604240996996
                    },
                    {
                        "who":1,
                        "msg":"我没做过心脏搭桥手术!",
                        "time":1604241986996
                    },
                    {
                        "who":1,
                        "msg":"恕无路可循!",
                        "time":1604241989996
                    }
                ]
            }
        ]
    };
    const MESSAGE_ME = 0;
    const MESSAGE_OTHER = 1;
    const NOW_TIME = new Date();
    class Message{
        constructor(who,msg,img,time){
            this.who = who;
            this.msg = msg.replace("\n","<br/>");
            this.img = img;
            this.time = time?time:NOW_TIME;
        }

        setTime(time){
            this.time = time;
        }

        getTimeString(){
            let now_day = NOW_TIME.getDate();
            let this_day = this.time.getDate();
            if(this_day==now_day){
                return this.time.format("hh:mm");
            }else if(this_day==now_day-1){
                return "昨天";
            }else{
                return this.time.format("MM-dd");
                // return this.time.getFullYear()+"/"+this.time.getMonth()+"/"+this_day;
            }

        }

        getHtml(){
            let s = "";
            switch(this.who){
                case MESSAGE_ME:
                    s = `
                    <div class="message-me">
                        <div class="message-me-text">
                            ${this.msg}
                        </div>
                        <div class="message-me-img">
                            <img src="${this.img}" alt="" width="36rem" height="36rem"/>
                        </div>
                    </div>
                    `
                    break;
                case MESSAGE_OTHER:
                    s = `
                    <div class="message-other">
                        <div class="message-other-img">
                            <img src="${this.img}" alt="" width="36rem" height="36rem"/>
                        </div>
                        <div class="message-other-text">
                            ${this.msg}
                        </div>
                    </div>
                    `
                    break;
            }
            return s;
        }
    }

    class ContactMessage{
        constructor(name,headImg,messageList){
            this.name = name;
            this.headImg = headImg;
            this.messageList = messageList;
            this.isChecked = false;
        }

        setChecked(checked){
            this.isChecked = checked;
        }

        getLatestMessage(){
            return this.messageList[this.messageList.length-1];
        }

        getHtml(){
            if(this.isChecked){
                return `<dt>
                            <div class="history-message-list-item-checked">
                                <img src=${this.headImg} alt="" width="12%">
                                <div style="display: flex;flex-direction: column;justify-content: space-between;flex: 3;margin-left: 0.5rem;">
                                    <div id="history-message-list-item-title">${autoClipText(this.name,7)}</div>
                                    <div id="history-message-list-item-subtitle">${autoClipText(this.getLatestMessage().msg,10)}</div>
                                </div>
                                <div id="time" style="flex: 1;">
                                    ${this.getLatestMessage().getTimeString()}
                                </div>
                            </div>
                        </dt>`
            }else{
                return `<dt>
                            <div class="history-message-list-item">
                                <img src="${this.headImg}" alt="" width="12%">
                                <div style="display: flex;flex-direction: column;justify-content: space-between;flex: 3;margin-left: 0.5rem;">
                                    <div id="history-message-list-item-title">${autoClipText(this.name,7)}</div>
                                    <div id="history-message-list-item-subtitle">${autoClipText(this.getLatestMessage().msg,10)}</div>
                                </div>
                                <div id="time" style="flex: 1;">
                                    ${this.getLatestMessage().getTimeString()}
                                </div>
                            </div>
                        </dt>`
            }
        }
    }

    const imgs = ["./images/test-head-img.jpg","./images/test-head-img.jpg"]
    let currentContact;
    let contactMessages = [];
    let myHeadImg;
    function setContactMessages(list){
        $("dl#history-message-list").html(function(i,old){
            let str = ""
            for(let i = 0;i<list.length;i++){
                let cur_contact_message = list[i];
                str += cur_contact_message.getHtml();
                str+="\n";
            }
            return str;
        })
    }

    function setMessageList(list){
        $("dl#current-messages").html(function(index,oldHtml){
            let str = ""
            // str+=addTimeDivider(CURRENT_TIME,list[0].time);
            for(let i = 0;i<list.length;i++){
                let cur_msg = list[i];
                if(i==0){
                    str+=addTimeDivider(cur_msg.time);
                }else{
                    str+=addTimeDivider(cur_msg.time,list[i-1].time);
                }
                str += cur_msg.getHtml();
                str+="\n";
            }
            
            return str;
        })
    }

    function addTimeDivider(cur_time,last_time){
        let time_string = "";
        if(!last_time||cur_time.getTime()>last_time.getTime()+10*60*1000){//第一个消息或者超过10分钟的消息显示一下时间
            if(!last_time)last_time=new Date(0);
            if(CURRENT_TIME.getTime()>last_time.getTime()+24*60*60*1000){//超过1天
                time_string=cur_time.format("yyyy年MM月dd日 hh:mm");
            }
            else{
                time_string=cur_time.format("hh:mm");
            }
            return `
                <div class="time-divider">
                    ${time_string}
                </div>
            `
        }
        return "";
        
    }

    function addMessage(list,msg,time){
        if(msg==""){
            return;
        }
        
        $("dl#current-messages").html(function(index,oldHtml){
            let message = new Message(MESSAGE_ME,msg,myHeadImg,time);
            list.push(message);
            let l = list.length;
            return oldHtml+"\n"+addTimeDivider(list[l-1].time,l>+2?list[l-2].time:null)+"\n"+message.getHtml();
        })
    }

    function send(){
        text = $("#input-text").val();
        addMessage(currentContact.messageList,text);
        $("#input-text").val("");
        var div = document.getElementById('current-messages-box');
        div.scrollTop = div.scrollHeight;
        let newContactMessages = [currentContact];
        contactMessages.forEach(each => {
            if(each!=currentContact){
                newContactMessages.push(each);
            }
        });
        contactMessages = newContactMessages;
        setContactMessages(contactMessages);
    }

    function autoClipText(string,maxLength){
        let l = 0;
        for(let i=0;i<string.length;i++){
            let c =string.charCodeAt(i);
            if(c<=255){
                l+=0.5;
            }else{
                l+=1;
            }
        }
        if(l<maxLength)return string;
        else{
            return string.substr(0,maxLength+1)+"...";
        }
    }

    function updateTime(){
        CURRENT_TIME;
    }


    function init(){
        myHeadImg = jsonData["head-img"];
        let contacts = jsonData.contactors;
        contacts.forEach(eachContact => {
            let messageList = [];
            eachContact.messages.forEach(eachMessage=>{
                let time;
                if(isNaN(eachMessage.time)){
                    switch(eachMessage.time){
                        case "now":
                            time = NOW_TIME;
                            break;
                    }
                }else{
                    time = new Date(eachMessage.time);
                }
                messageList.push(new Message(eachMessage.who,eachMessage.msg,eachMessage.who==MESSAGE_ME?myHeadImg:eachContact.head_img,time));
            })
            let cm = new ContactMessage(eachContact.name,eachContact.head_img,messageList);
            contactMessages.push(cm);
        });
        // for (let i = 0; i < 4; i++) {
            
        //     messages.push(new Message(MESSAGE_ME,"我说的话",imgs[0]));
        //     messages.push(new Message(MESSAGE_OTHER,"别人说的话",imgs[1],Date.parse(NOW_TIME.getMilliseconds()-1010000000)));
        //     let cm = new ContactMessage("测试姓名"+i,imgs[0],messages);
        //     contactMessages.push(cm);
        // }
        

        $("#button-send").click(function(){
            send();
        })
        $("#input-text").keypress(function(e){
            if(e.which==13){
                send();
            }
        });
        
        // $("history-message-list-item").on("click",function(){
        //     alert("click");
        // })
    }

    const CURRENT_TIME = new Date();
    init();
    currentContact = contactMessages[0];
    contactMessages[0].setChecked(true);
    setContactMessages(contactMessages);
    setMessageList(currentContact.messageList);
    $(document).on("click",".history-message-list-item",function(){
        let index = $(this).parent().index();
        currentContact = contactMessages[index];
        contactMessages.forEach(element => {
            element.setChecked(false);
        });
        currentContact.setChecked(true);
        setMessageList(currentContact.messageList);
        setContactMessages(contactMessages);
        $("#name").text(currentContact.name);
    });
});
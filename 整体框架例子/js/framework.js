$(document).ready(function(){
    const configurationData = [
        {
            "head-image":"./images/test-head-img.jpg",
            "image":"./images/back-1.jpg",
            "text":"这是第一个文本",
            "name":"人名1"
        },
        {
            "head-image":"./images/test-head-img-2.jpg",
            "text":"这是第二个文本，这个页面可以选择",
            "name":"name 2",
            "switch":[
                {
                    "to":2,
                    "switch-text":"点击会跳转到第3个页面"
                },
                {
                    "to":3,
                    "switch-text":"点击会跑去第4个页面"
                }
            ],
        },
        {
            "head-image":"./images/test-head-img-3.jpg",
            "text":"这是第3个文本",
        },
        {
            "image":"./images/back-1.jpg",
            "head-image":"./images/test-head-img.jpg",
            "text":"这是第4个文本",
            "switch":[
                {
                    "to":0,
                    "switch-text":"点击会回到第一个界面"
                },
                {
                    "to":function(){
                        window.location.href = "./example-site.html"
                    },
                    "switch-text":"点击打开其他界面"
                }
            ],
        },
        {
            "head-image":"./images/test-head-img-2.jpg",
            "text":"这是第5个文本",
            "switch":[
                {
                    "to":0,
                    "switch-text":"点击会回到第一个界面"
                },
                {
                    "to":0,
                    "switch-text":"回到第一个页面"
                }
            ],
        },
    ]
    $("#image").click(function(){
        next();
        localStorage.currentIndex = currentIndex;
    })
    $("#button-forward").on("click",function(){//左边 按钮的点击事件
        click_left_button();
        localStorage.currentIndex = currentIndex;
    })
    $("#button-next").click(function(){//右边 按钮的点击事件
        click_right_button();
        localStorage.currentIndex = currentIndex;
    })
    const IMAGE_ID = "image";
    const HEAD_IMAGE_ID = "head-image";
    const TEXT_ID = "text";
    const NAME_ID = "name";
    const FORWARD_BUTTON_ID = "button-forward";
    const NEXT_BUTTON_ID = "button-next";

    let currentIndex = localStorage.currentIndex?Number(localStorage.currentIndex):0;//当前处在第几个页面
    analyseData(currentIndex);

    function analyseData(index){
        let each_configuration = configurationData[index];
        if(each_configuration.image){//要是有设置图片属性
            $(`#${IMAGE_ID}`).attr("src",each_configuration.image);
        }
        if(each_configuration["head-image"]){//要是有设置图片属性
            $(`#${HEAD_IMAGE_ID}`).attr("src",each_configuration["head-image"]);
        }
        if(each_configuration.text){
            $(`#${TEXT_ID}`).text(each_configuration.text);
        }
        if(each_configuration.name){
            $(`#${NAME_ID}`).text(each_configuration.name);
        }
        if(each_configuration.switch){
            $(`#${FORWARD_BUTTON_ID}`)
                .text(each_configuration.switch[0]["switch-text"])
                .show();

            $(`#${NEXT_BUTTON_ID}`)
                .text(each_configuration.switch[1]["switch-text"])
                .show();
        }else{
            $(`#${FORWARD_BUTTON_ID}`).hide();
            $(`#${NEXT_BUTTON_ID}`).hide();
        }
        // if(each_configuration["forward-button-text"]){//如果设置了 上一个 按钮的文本
        //     $(`#${FORWARD_BUTTON_ID}`).text(each_configuration["forward-button-text"]);
        // }else{
        //     $(`#${FORWARD_BUTTON_ID}`).text("上一个");
        // }
        // if(each_configuration["next-button-text"]){//如果设置了 下一个 按钮的文本
        //     $(`#${NEXT_BUTTON_ID}`).text(each_configuration["next-button-text"]);
        // }else{
        //     $(`#${NEXT_BUTTON_ID}`).text("下一个");
        // }
        // if(each_configuration["non-button"]){
        // }else{
        //     $(`#${FORWARD_BUTTON_ID}`).show();
        //     $(`#${NEXT_BUTTON_ID}`).show();
        // }
    }

    function next(){
        if(configurationData[currentIndex].switch){
            return;
        }
        if (currentIndex == configurationData.length - 1) {
            return;
        }
        analyseData(++currentIndex);
    }

    function click_right_button() {
        const eachSwitch = configurationData[currentIndex].switch[1];
        let to = eachSwitch.to;
        if (to==undefined) {
            if (currentIndex == configurationData.length - 1) {
                return;
            }
            analyseData(++currentIndex);
            return;
        }
        if (typeof to == "function") {
            to();
        } else if (typeof to == "number") {
            analyseData(to);
            currentIndex = to;
        }
    }

    function click_left_button(){
        const eachSwitch = configurationData[currentIndex].switch[0];
        let to = eachSwitch.to;
        if (to==undefined) {
            if (currentIndex == 0) {
                return;
            }
            analyseData(--currentIndex);
            return;
        }
        if (typeof to == "function") {
            to();
        } else if (typeof to == "number") {
            analyseData(to);
            currentIndex = to;
        }
    }
});
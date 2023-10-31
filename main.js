//监听dom挂载
document.ready = function(callback){
    if(document.readyState == 'complete'){
        callback();
    }else if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',callback());
    }else{
        document.attachEvent('onreadystatechange',function(){
            if(document.readyState == 'complete'){
                callback();
            }
        })
    }
}

document.ready(init);

//初始化事件
function init(){
    const screen = document.getElementById('screen');
    const content = document.getElementById('content');
    const sendBtn = document.getElementById('send');
    const cleanBtn = document.getElementById('clean');
    const minSpeed = 10;
    const maxSpeed = 2;
    const minFontSize = 12;
    const maxFontSize = 36;
    let pool = [];
    let queue = [];

    sendBtn.onclick = function (){
        try {
            send();
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    cleanBtn.onclick = function (){
        clear();
    }

    //获取一个弹幕元素
    function getSpan(text = ''){
        let span;
        if(pool.length > 0){
            span = pool.shift();
        }else{
            span = createSpan();
        }
        span.innerText = text;
        return span;
    }

    //创建一个弹幕元素
    function createSpan(){
        let span = document.createElement('span');
        span.className = 'barrage';
        return span;
    }

    //挂载span
    function appendSpan(span){
        queue.push(span);
        screen.appendChild(span);
    }

    //回收span节点
    function recycleSpan(span){
        screen.removeChild(span);
        console.log("span",span);
        pool.push(span);
        queue = queue.filter((s)=> s !== span);
        console.log("池子",pool);
        console.log("队列",queue);
    }

    //预处理span样式
    function spanStyle(span){
        span.style.position = 'absolute';
        span.style.fontSize = random(minFontSize,maxFontSize) + 'px';
        span.style.color = generateRandomColor();
        span.style.top = random(0,screen.clientHeight - span.clientHeight) + 'px';
        span.style.right = - span.clientWidth + 'px';
    }

    //弹幕动画
    function animateSpan(span){
        let transform = `translateX(-${(screen.clientWidth + span.clientWidth)}px)`;
        let duration = random(maxSpeed,minSpeed)*1000;
        const aniFunc = span.animate({transform},{duration,easing:'linear'})
        span.aniFunc = aniFunc;
        aniFunc.finished.then((e)=>{
            if(e.effect && e.effect.target){
                recycleSpan(e.effect.target);
            }
        })
        span.onmouseover = (e)=>{
            aniFunc.pause();
        }
        span.onmouseout = (e)=>{
            aniFunc.play();
        }
    }

    //发送
    function send(){
        let msg = content && content.value;
        if(!msg){
            throw new Error("请输入弹幕内容！");
        }
        let span = getSpan(msg);
        appendSpan(span);
        spanStyle(span);
        animateSpan(span);
        console.log("发送",msg,span);
    }

    //清屏
    function clear(){
        console.log("清屏");
        if(queue.length>0){
            queue.forEach(item=>{
                console.log("item",item.aniFunc.finish());
            })
        }
    }   

    /**
     * 随机数函数
     * @param {*} min 
     * @param {*} max 
     */
    function random(min,max){
        return Math.round(Math.random() * (max - min)) + min;
    }
    
    /**
     * △E算法是一种衡量两个颜色之间色差的计算方法。它基于Lab颜色空间，通过计算L、a和b值的差异来得出色差。公式如下：△E = [(ΔL*)^2 + (Δa*)^2 + (Δb*)^2]^1/2;
     * 人眼可见的色差值1.5-3△E之间，这边用3△E为标准，确保不随机生成跟背景颜色太相近的肉眼不可见的颜色值；
     */
    function generateRandomColor() {  
        // 生成随机颜色值  
        var randomColor = Math.floor(Math.random() * 0xFFFFFF);  
        
        // 将颜色值转换为十六进制格式  
        var color = '#' + ('000000' + randomColor.toString(16)).slice(-6);  
        
        // 计算与白色的色差（使用 Euclidean distance 算法）  
        var rgb = parseInt(color.slice(1), 16);  
        var whiteRgb = parseInt('FFFFFF', 16);  
        var red = (rgb >> 16) & 0xFF;  
        var green = (rgb >> 8) & 0xFF;  
        var blue = rgb & 0xFF;  
        var whiteRed = (whiteRgb >> 16) & 0xFF;  
        var whiteGreen = (whiteRgb >> 8) & 0xFF;  
        var whiteBlue = whiteRgb & 0xFF;  
        var redDifference = Math.abs(red - whiteRed);  
        var greenDifference = Math.abs(green - whiteGreen);  
        var blueDifference = Math.abs(blue - whiteBlue);  
        var totalDifference = Math.sqrt(redDifference * redDifference + greenDifference * greenDifference + blueDifference * blueDifference);  
        
        // 如果色差小于3，则重新生成颜色  
        if (totalDifference < 3) {  
          return generateRandomColor();  
        }  
        
        return color;  
    }  
}



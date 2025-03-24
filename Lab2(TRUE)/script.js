// файл script.js
window.onload = function(){ 

   
    let selectedOperation = null
    let a = ''
    // окно вывода результата
    result = document.getElementById("result")
    hist = document.getElementById("hist")
    // список объектов кнопок циферблата (id которых начинается с btn_digit_)
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
    
    function onDigitButtonClicked(digit) {
        if(a.length<9){
            hist.textContent+=digit
            a+=digit
            if(result.textContent=="?"){
                result.textContent=""
            }   
            result.textContent+=digit
        }
        
    }
    
    
    // устанавка колбек-функций на кнопки циферблата по событию нажатия
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML
            onDigitButtonClicked(digitValue)
        }
    });
    
    // установка колбек-функций для кнопок операций
    document.getElementById("btn_op_mult").onclick = function() { 
         hist.textContent+='*'
         result.textContent = '?'
         a = ''
    }
    document.getElementById("btn_op_plus").onclick = function() { 
        hist.textContent+='+'
         result.textContent = '?'
         a = ''
    }
    document.getElementById("btn_op_minus").onclick = function() { 
         hist.textContent+='-'
          result.textContent = '?'
        a =''
    }
    document.getElementById("btn_op_div").onclick = function() { 
         hist.textContent+='/'
          result.textContent = '?'
        a = ''
    }
    
    document.getElementById("point_btn").onclick = function(){
        hist.textContent+="."
        result.textContent+="."
    }
    // кнопка очищения
    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        result.innerHTML = '?'
        hist.textContent = ''
    }
    
    // кнопка расчёта результата

    function do_operation(){
        let promez_res = parseFloat(eval(hist.textContent).toFixed(4)).toString()
        result.textContent = promez_res
        hist.textContent = promez_res
    }
    document.getElementById("btn_op_equal").onclick = function() { 
        do_operation()
    }


    //Бабулехово

    //1)Смена фона
    document.getElementById("btn_change_background").onclick = function(){
        const background = document.getElementById("animatedBackground")
        if(background.className == "animatedBackground floppa"){
            background.className = "animatedBackground retrowave"
        } else{
            background.className = "animatedBackground floppa"
        }
    }

    //2)Смена окна

    document.getElementById("btn_change_window").onclick = function(){
        const window = document.getElementById("screen")
        if(window.className == "screen violet"){
            window.className = "screen"
        } else{
            window.className = "screen violet"
        }
    }

    //3)Стирание одного символа
    function del_symb(){
        result.textContent = result.textContent.slice(0, -1)
        hist.textContent = hist.textContent.slice(0, -1)
        a = a.slice(0, -1   )
    }
    document.getElementById("btn_DEL").onclick = function(){
        del_symb()
    }

    //4) Процент
    document.getElementById("btn_percent").onclick = function(){
        
        a = eval(hist.textContent)
            a = parseFloat(parseInt(a)/100).toString()
            result.innerHTML = a
            hist.textContent = a
      
       
    }

    //5) три нуля

    document.getElementById("btn_tri_plus").onclick = function(){
          
        a = eval(hist.textContent)
            a+="000"
            result.innerHTML = parseFloat(a)
            hist.textContent = a
        
    }

    //6) Квадрат

    document.getElementById("btn_pow").onclick = function(){
        
            a = eval(hist.textContent)
            a = parseFloat(a)*parseFloat(a)
            
            result.textContent = parseFloat(a)
            hist.textContent = a
        
    }

    //7) LN

    document.getElementById("btn_ln").onclick = function(){
            a = eval(hist.textContent)
            a = parseFloat(Math.log(a)).toFixed(4).toString()
            result.innerHTML = a
            hist.textContent = a
        
    }

    //8) факториал

    document.getElementById("btn_op_fact").onclick = function(){
        function fact(n){
            let ans = 1;
            n = parseInt(n)
            for(let i = 1; i<=n; i++){
                ans*=i;
            }
            return ans
        } 
            a = eval(hist.textContent)
            a = fact(parseInt(a))
            result.innerHTML = a
            hist.textContent = a
       
    }

    //9) +-

    document.getElementById("btn_plus_minus").onclick = function(){
     
            a = -a
            result.innerHTML = a
           
    }

    //10) квадратный корень

    document.getElementById("btn_sqrt").onclick = function(){
            a = eval(hist.textContent)
            a = parseFloat(Math.sqrt(a).toFixed(4)).toString()
            result.innerHTML = a
            hist.textContent = a
    }

   //Нажатие кнопок

   
    function handleKeyPress(event) {
    if (event.key === "Shift" || event.key === "Control") {
        return;
    }
        const key = event.key
        const isShiftPressed = event.shiftKey;
        if(parseInt(key) >=0 && parseInt(key)<10){

            onDigitButtonClicked(key)
        }
        if(key == "Backspace"){
            del_symb()
        }
        if(key == "+" && isShiftPressed){
            event.preventDefault();
            hist.textContent+='+'
            result.textContent = '?'
            a = ''
        }
        if(key == "-"){
            event.preventDefault();
            hist.textContent+='-'
            result.textContent = '?'
            a = ''
        }
        if((key =="/" || key == ".")){
            event.preventDefault();
            hist.textContent+='/'
            result.textContent = '?'
            a = ''
            
        }
        if(key =="*"){
            event.preventDefault();
            hist.textContent+='*'
            result.textContent = '?'
            a = ''
        }
        if(key == "." || (key == "ю" && isShiftPressed)){
             hist.textContent+="."
            result.textContent+="."
        }
        if(key == "=" || key == "Enter"){
            do_operation()
        }
   }
   document.addEventListener('keydown', handleKeyPress);
};
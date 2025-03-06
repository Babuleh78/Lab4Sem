// файл script.js
window.onload = function(){ 

    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null
    
    // окно вывода результата
    result = document.getElementById("result")
    hist = document.getElementById("hist")
    // список объектов кнопок циферблата (id которых начинается с btn_digit_)
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
    
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
                if(a.length<12){
                    a += digit
                }
            }
            result.innerHTML = parseInt(a)
            hist.textContent += digit.toString()
            
        } else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
                if(b.length<12){
                    b += digit
                }
                result.innerHTML = parseInt(b)  
                hist.textContent += digit.toString() 
            }
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
        if (a === '') return
        selectedOperation = 'x'
        hist+='x'
    }
    document.getElementById("btn_op_plus").onclick = function() { 
        if (a === '') return
        selectedOperation = '+'
        hist+='+'
    }
    document.getElementById("btn_op_minus").onclick = function() { 
        if (a === '') return
        selectedOperation = '-'
        hist+='-'
    }
    document.getElementById("btn_op_div").onclick = function() { 
        if (a === '') return
        selectedOperation = '/'
        hist+='/'
    }
    
    // кнопка очищения
    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        result.innerHTML = 0
        hist.textContent = ''
    }
    
    // кнопка расчёта результата

    function do_operation(){
        if (a === '' || b === '' || !selectedOperation)
            return
            
        switch(selectedOperation) { 
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;
        }
        
        a = expressionResult.toString()
       
        if(a.includes(".")){
            result.innerHTML = parseFloat(a).toString()
        } else{
            result.innerHTML = parseInt(a)
        }
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
        if (!selectedOperation) {
            if(a.length >1){
                 a = a.slice(0, -1)
                result.innerHTML = a
                hist.textContent = hist.textContent.slice(0, -1)
            } else{
                result.innerHTML = 0
            }
        } else {
            if (b.length>1){ 
                b = b.slice(0, -1)
                result.innerHTML = b
                hist.textContent = hist.textContent.slice(0, -1)
            } else{
                result.innerHTML = 0
            }
        }
    }
    document.getElementById("btn_DEL").onclick = function(){
        del_symb()
    }

    //4) Процент
    document.getElementById("btn_percent").onclick = function(){
        
        if(a!='' && !selectedOperation){
            a = parseFloat(parseInt(a)/100).toString()
            result.innerHTML = a
        } 
        else if(b!='' && selectedOperation){  
            b =  parseFloat(parseInt(b)/100).toString()
            result.innerHTML = b
        }
       
    }

    //5) три нуля

    document.getElementById("btn_tri_plus").onclick = function(){
          
        if (!selectedOperation) {
            a+="000"
            result.innerHTML = parseFloat(a)
        } else {
            b+="000"
            result.innerHTML = parseFloat(b)
        }
    }

    //6) Квадрат

    document.getElementById("btn_pow").onclick = function(){
        if (!selectedOperation) {
            a = parseFloat(a)*parseFloat(a)
            
            result.innerHTML = parseFloat(a)
        } else {
            b = parseFloat(b)*parseFloat(b)
            result.innerHTML = parseFloat(b)
        }
    }

    //7) LN

    document.getElementById("btn_ln").onclick = function(){
        if (!selectedOperation) {
            a = parseFloat(Math.log(a)).toFixed(10).toString()
            result.innerHTML = a
        } else {
            b = parseFloat(Math.log(b)).toFixed(10).toString()
            result.innerHTML = b
        }
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
        if (!selectedOperation) {
            a = fact(parseInt(a))
            result.innerHTML = a
        } else {
            b = fact(parseInt(b))
            result.innerHTML = b
        }
    }

    //9) +-

    document.getElementById("btn_plus_minus").onclick = function(){
        if (!selectedOperation) {
            a = -a
            result.innerHTML = a
        } else {
            b = -b
            result.innerHTML = b
        }
    }

    //10) квадратный корень

    document.getElementById("btn_sqrt").onclick = function(){
        if (!selectedOperation) {
            a = parseFloat(Math.sqrt(a).toFixed(10)).toString()
            result.innerHTML = a
        } else {
            b = parseFloat(Math.sqrt(b).toFixed(10)).toString()
            result.innerHTML = b
        }
    }

   //Нажатие кнопок

   
    function handleKeyPress(event) {
    if (event.key === "Shift" || event.key === "Control") {
        return;
    }
        const key = event.key
        console.log(key)
        const isShiftPressed = event.shiftKey;
        if(parseInt(key) >=0 && parseInt(key)<10){

            onDigitButtonClicked(key)
        }
        if(key == "Backspace"){
            del_symb()
        }
        if(key == "+" && isShiftPressed){
            event.preventDefault();
             if (a === '') return
            selectedOperation = '+'
            hist.textContent+='+'
        }
        if(key == "-"){
            event.preventDefault();
             if (a === '') return
            selectedOperation = '-'
            hist.textContent+='-'
        }
        if((key =="/" || key == ".")){
            event.preventDefault();
            if (a === '') return
            selectedOperation = '/'
            hist.textContent+='/'
            
        }
        if(key =="x" || key == "ч"){
            event.preventDefault();
             if (a === '') return
            selectedOperation = 'x'
            hist.textContent+='x'
        }
        if(key == "=" || key == "Enter"){
            do_operation()
        }
   }
   document.addEventListener('keydown', handleKeyPress);
};
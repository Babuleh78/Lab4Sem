// файл script.js
window.onload = function(){ 

    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null
    
    // окно вывода результата
    result = document.getElementById("result")
    
    // список объектов кнопок циферблата (id которых начинается с btn_digit_)
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
    
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
                a += digit
            }
            result.innerHTML = parseInt(a)
        } else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
                b += digit
                result.innerHTML = parseInt(b)   
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
    }
    document.getElementById("btn_op_plus").onclick = function() { 
        if (a === '') return
        selectedOperation = '+'
    }
    document.getElementById("btn_op_minus").onclick = function() { 
        if (a === '') return
        selectedOperation = '-'
    }
    document.getElementById("btn_op_div").onclick = function() { 
        if (a === '') return
        selectedOperation = '/'
    }
    
    // кнопка очищения
    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        result.innerHTML = 0
    }
    
    // кнопка расчёта результата
    document.getElementById("btn_op_equal").onclick = function() { 
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
        b = ''
        selectedOperation = null
        if(a.includes(".")){
            result.innerHTML = parseFloat(a).toString()
        } else{
            result.innerHTML = parseInt(a)
        }
        a = ''
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
    document.getElementById("btn_DEL").onclick = function(){
        if (!selectedOperation) {
            if(a.length >1){
                 a = a.slice(0, -1)
                result.innerHTML = parseInt(a)
            } else{
                result.innerHTML = 0
            }
        } else {
            if (b.length>1){ 
                b = b.slice(0, -1)
                result.innerHTML = parseInt(b)
            } else{
                result.innerHTML = 0
            }
        }
    }

    //4) Процент
    document.getElementById("btn_percent").onclick = function(){
        
        if(a!=''){
            result.innerHTML = parseFloat(parseInt(a)/100).toString()
        } 
        if(b!=''){  
            result.innerHTML = parseFloat(parseInt(a)/100).toString()
        }
        a = ''
        b = ''
    }

    //5) три нуля

    document.getElementById("btn_tri_plus").onclick = function(){
          
        if (!selectedOperation) {
            a+="000"
            result.innerHTML = parseInt(a)
        } else {
            b+="000"
            result.innerHTML = parseInt(b)
        }
    }
};
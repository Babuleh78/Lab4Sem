
// Напишите функцию flatten, которая будет принимать на вход массив массивов
//  и создавать из них один общий массив. Массивы могут быть любой вложенности

// Пример:

// [1, 2, 3, [4, 5, 6, [10, 20, 30]]] -> [1, 2, 3, 4, 5, 6, 10, 20 ,30]
const util = require('util');
function flatten(arr) {
    let result = []; 
    
    for (const item of arr) {
      if (Array.isArray(item)) {
        result.push(...flatten(item)); 
      } else {
        result.push(item);
      }
    }
    
    return result;
  }

const ourArray = [1, 2, 3, [4, 5, 6, [10, 20, 30, [40, 50, 60,[[],[]]]]]];
console.log(flatten(ourArray));

//[1, 2, 3, 4, 5] -> [1, [2, [3, [4, [5]]]]]
function dop(arr) {
  if (arr.length === 0) return [];
  
  let result = [arr[arr.length - 1]];
  for (let i = arr.length - 2; i >= 0; i--) {
    result = [arr[i], result];
  }
  
  return result;
}
const mas = [1, 2, 3, 4, 5];
console.log(util.inspect(dop(mas), { depth: null, compact: true }));  

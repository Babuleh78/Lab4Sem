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

const nestedArray = [1, 2, 3, [4, 5, 6, [10, 20, 30]]];
const flatArray = flatten(nestedArray);
console.log(flatArray); 
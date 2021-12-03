input: array = ['a','b','c','a','a','c','a','b','b','c']
output : array = ['a','b','c']
//Tính giai thừa 
//6*5*4*3*2*1 = 720
function giaithua(number){
  if(number > 0){
    return number*giaithua(number -1)
  }
  return 1;
}
console.log(giaithua(6))
var t = function(){
  return new Promise(function(resolve){
    resolve(1234);
  })
}


var p1 = Promise.resolve(3);
var p2 = t();
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([p1, p2, p3]).then(values => {
  console.log(values); // [3, 1337, "foo"]
});

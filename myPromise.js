const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise(executor){
  var that = this;
  this.onFulfilled = [];
  this.onRejected = [];
  this.state = PENDING;
  this.value = undefined;
  this.reason = undefined;
  function resolve(value){
    if(that.state === PENDING){
      that.state = FULFILLED;
      that.value = value;
      that.onFulfilled.forEach(fn=>fn(value));
    }
  }
  function reject(reason){
    if(that.state === PENDING){
      that.state = REJECTED;
      that.reason = reason;
      that.onRejected.forEach(fn=>fn(reason));
    }
  }
  try{
    executor(resolve, reject);
  }catch(e){
    reject(e);
  }
}
Promise.prototype.then = function(onFulfilled, onRejected){
  let _this = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
  let promise2 = new Promise(function(resolve, reject){
    if(_this.state === FULFILLED){
      setTimeout(()=>{
        try {
          let x = onFulfilled(_this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        }
      });
    }else if(_this.state === REJECTED){
      setTimeout(()=>{
        try {                    
          let x = onRejected(_this.reason)
          resolvePromise(promise2, x ,resolve, reject);
        } catch (error) {
          reject(error);
        }
      })  
     }else if(_this.state === PENDING){
       _this.onFulfilled.push(()=>{
         setTimeout(()=>{
           try {                        
             let x = onFulfilled(_this.value);
             resolvePromise(promise2, x, resolve, reject);
           } catch (error) {
             reject(error);
            }
         });
       });
       _this.onRejected.push(()=>{
         setTimeout(()=>{
           try {                        
             let x = onRejected(_this.reason);
             resolvePromise(promise2, x ,resolve, reject);
           } catch (error) {
             reject(error);
           }
         });
       });
	   
     }
  });
  
  return promise2;
}

function resolvePromise(promise2, x, resolve, reject){
  console.log(x);
  if(promise2 === x){
    reject(new TypeError('Chaining cycle'))
  }
  if(x && typeof x === 'object' || typeof x === 'function'){
    let used;
    try {
      let then = x.then;
      if(typeof then === 'function'){
        then.call(x, (y)=>{
          if (used) return;
          used = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (r) =>{
          if (used) return;
          used = true;
          reject(r);
        });
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch(e){
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
  
}


let myPro = new Promise(function(resolve, reject){
  setTimeout(function(){
    resolve(3);
  }, 1000)
}).then(function(res){
  console.log(res);
}, function(e){
  console.log(e);
});
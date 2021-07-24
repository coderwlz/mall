import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
export default {
    addCart(context,payload){
        //方式一：
        // let oldProduct = null;
        // for(let item of state.cartList){
        //   if(item.iid === payload.iid){
        //     oldProduct = item;
        //   }
        // }
        return new Promise((resolve,reject)=>{
            //方式二:
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            //2.判断oldProduct
            if(oldProduct){
              context.commit(ADD_COUNTER,oldProduct)
              resolve('商品数量加1！')
            }else{
              payload.count = 1
              context.commit(ADD_TO_CART,payload)
              resolve('添加商品成功！')
            }
            reject('添加失败')
        })
        
      }
}

interface Result<T = any>{
    success:boolean,
    msg?:string
    data?:T
}


interface WsMessage<T = any>{
    type:string,
    data:T
}
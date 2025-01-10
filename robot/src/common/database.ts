import mongoose, { Mongoose } from "mongoose";


const state = {
  conn: <Mongoose | null>null,
};


export async function initDatabase() {


  state.conn = await mongoose.connect(process.env.MONGODB_CONNECTION ?? "");
  mongoose.set("overwriteModels",true)


}

export function getConnection() {
  return state.conn!;
}



// const mongo = require("mongoose")
// const MoyuCounter = mongo.model("MoyuCounter", new mongo.Schema({
//   room_wxid:String,
//   wxid:String,
//   day:String,
//   count:Number
// }))


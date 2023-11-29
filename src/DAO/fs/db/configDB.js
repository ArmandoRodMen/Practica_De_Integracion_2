import mongoose from "mongoose";

const URI = "mongodb+srv://ArmandoRod:coderhouse@cluster0.yl8erzs.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.connect(URI)
.then(()=>console.log("Conectado a la DB"))
.catch(error => console.log(error))
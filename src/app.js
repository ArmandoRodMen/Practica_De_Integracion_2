import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import messageRouter from "./routes/messages.router.js";
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import "./passport.js";
import passport from "passport";
import fileStore from "session-file-store";
const FileStore = fileStore(session);
import MongoStore from "connect-mongo";
import "../src/DAO/fs/db/configDB.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));
app.use(express.static(__dirname + "/public"));

const URI = "mongodb+srv://ArmandoRod:coderhouse@cluster0.yl8erzs.mongodb.net/ecommerce?retryWrites=true&w=majority";

//mongo
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }), 
        secret: "secretSession", 
        cookie:{maxAge:60000},
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/chat", messageRouter);
app.use("/", viewsRouter);

app.listen(8080, () => {
    console.log("Escuchando puerto 8080");
});
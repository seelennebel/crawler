import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import path from "path";
import json_router from "./routers/json_router.js";
import file_router from "./routers/file_router.js";

console.log(process.env)

dotenv.config()
const __dirname = import.meta.dirname;

const PORT = process.env.PORT || 8080;

const app = express();

app.use("/api", json_router);
app.use("/api", file_router);

app.use(express.static(path.join(__dirname, "/../frontend/dist/")));

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/../frontend/dist/index.html"));
});
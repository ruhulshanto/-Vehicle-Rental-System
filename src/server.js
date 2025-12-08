"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 5000;
const pool = new pg_1.Pool({
    connectionString: ``
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/", (req, res) => {
    console.log(req.body);
    res.status(200).json({
        status: "success",
        message: "Data received successfully",
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

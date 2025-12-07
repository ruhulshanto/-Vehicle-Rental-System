import express, { Request, Response } from "express";
import {Pool} from "pg"

const app = express();
app.use(express.json());

const port = 5000;

const pool = new Pool({
    connectionString: ``
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/", (req: Request, res: Response) => {
 console.log(req.body);
 res.status(200).json({
    status: "success",
    message: "Data received successfully",
 })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import { app } from "../app";
import config from "./config";


const port = config.port || 5000;

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
  console.log(` Health check: http://localhost:${port}`);
  console.log(` Auth test: POST http://localhost:${port}/api/v1/auth/signup`);
  console.log(` Login test: POST http://localhost:${port}/api/v1/auth/signin`);
});
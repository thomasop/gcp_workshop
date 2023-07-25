import { server } from "./app";
import dotenv from "dotenv";
dotenv.config();

let port = 8080;

server.listen(process.env.PORT, () => {
  console.log("App listen on port 8080");
});

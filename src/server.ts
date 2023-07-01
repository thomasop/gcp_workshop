import app from "./app.js";
import { server } from "./app.js";

let port = 8080;

server.listen(port, () => {
  console.log("App listen on port 8080");
});

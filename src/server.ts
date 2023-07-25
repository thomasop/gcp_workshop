import { server } from "./app";

let port = 8080;

server.listen(port, () => {
  console.log("App listen on port 8080");
});

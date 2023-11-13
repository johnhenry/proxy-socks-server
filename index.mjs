import { Server } from "npm:proxy-socks@0.0.2";
const server = new Server(() => new Response("no responder", { status: 500 }), {
  strategy: "random",
});
Deno.serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return server.fetch(req);
  }
  const { socket: connection, response } = Deno.upgradeWebSocket(req);
  server.addConnection(connection);
  connection.addEventListener("close", () => {
    server.removeConnection(connection);
  });
  return response;
});

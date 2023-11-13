import { Server } from "npm:proxy-socks";
const server = new Server(() => new Response("no responder", { status: 500 }));
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

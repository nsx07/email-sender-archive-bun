/// <reference path="node_modules/bun-types/types.d.ts" />

import { env, serve } from "bun";
import { BaseResponse } from "./utils/Http";
import { Router } from "./core/router";
import { routerEmail } from "./routes/email-dispatcher";

export const router = new Router(true);

router.appendRoute("teste", (url, req, serv) => new BaseResponse(200, "teste funciona!"))
router.appendRouter("email", routerEmail);

const server = serve({
  async fetch(req, server) {    
    let url = new URL(req.url);
  
    if (url.pathname === "/") {
      return new BaseResponse(200, "Hello World!");
    }
    
    return await router.handleRequest(url.pathname, url, req, server);
  },
  port: env["PORT"] ?? 3000
});

console.log(`Listening on ${server.hostname}:${server.port}`);
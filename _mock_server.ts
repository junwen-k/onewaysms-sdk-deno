// Copyright 2020 KwanJunWen. All rights reserved. MIT license.
import {
  listenAndServe,
  ServerRequest,
  Status,
} from "https://deno.land/std/http/mod.ts";
import { decode } from "https://deno.land/std/node/querystring.ts";
import { HOSTNAME, PORT } from "./_mock_config.ts";

console.log(`OneWay test server running at http://${HOSTNAME}:${PORT}/`);
listenAndServe(
  { port: PORT, hostname: HOSTNAME },
  (req: ServerRequest): void => {
    let qs: { [key: string]: string | string[] } = {};
    const qsmatch = req.url.match(/\?(.*)/);
    if (qsmatch && qsmatch.length > 0) {
      qs = decode(qsmatch[1]);
    }
    const {
      apiusername,
      apipassword,
      senderid,
      mobileno,
      message,
      languagetype,
      mtid,
    } = qs;
    if (req.url.includes("/api.aspx")) {
      if (apiusername === "invalid" || apipassword === "invalid") {
        req.respond({ body: "-100" });
        return;
      }
      if (senderid === "invalid") {
        req.respond({ body: "-200" });
        return;
      }
      if (mobileno === "invalid") {
        req.respond({ body: "-300" });
        return;
      }
      // Mock invalid language type
      if (languagetype === "2") {
        req.respond({ body: "-400" });
        return;
      }
      if (message === "invalid") {
        req.respond({ body: "-500" });
        return;
      }
      if (message === "insufficient credit balance") {
        req.respond({ body: "-600" });
        return;
      }
      if (message === "unknown error") {
        req.respond({ body: "random" });
        return;
      }
      if (message === "request failure") {
        req.respond({ status: Status.InternalServerError });
        return;
      }
      if (mobileno === "60123456789,60129876543") {
        req.respond({ body: "145712468,145712469" });
        return;
      }
      if (mobileno === "60123456789") {
        req.respond({ body: "145712468" });
        return;
      }
      return;
    }
    if (req.url.includes("/bulktrx.aspx")) {
      if (mtid === "1") {
        req.respond({ body: "-100" });
        return;
      }
      if (mtid === "2") {
        req.respond({ body: "-200" });
        return;
      }
      if (mtid === "3") {
        req.respond({ body: "random" });
        return;
      }
      if (mtid === "145712470") {
        req.respond({ body: "0" });
        return;
      }
      if (mtid === "145712471") {
        req.respond({ body: "100" });
        return;
      }
      return;
    }
    if (req.url.includes("/bulkcredit.aspx")) {
      if (apiusername === "invalid" || apipassword === "invalid") {
        req.respond({ body: "-100" });
        return;
      }
      if (apiusername === "unknown error" || apipassword === "unknown error") {
        req.respond({ body: "random" });
        return;
      }
      if (apiusername === "Username" || apipassword === "Password") {
        req.respond({ body: "6500" });
        return;
      }
      return;
    }
  },
);

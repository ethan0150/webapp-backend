// @deno-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "npm:express@4.21.1";
// @deno-types="npm:@types/multer"
import multer from "npm:multer2"
import * as fs from 'node:fs';
import { ChatEntry } from "./model.ts";
import * as logic from './logic.ts';
const app = express();
const upload = multer({ dest: 'uploads/' });

app.get("/", (_req: Request, res: Response ) => {
  res.send("Welcome to the Dinosaur API!");
  // TODO: send frontend (index.html etc.)
});

app.get("/prev_chat/:scenario", (req: Request, res: Response) => {
  res.status(200).send(logic.getChat(req.body.scenario));
});

app.post("/speech", upload.single('speech'), (req: Request, res: Response) => {
  const speechPath: string | undefined = req.file?.path;
  if(speechPath === undefined){
    res.status(500);
    return;
  }
  console.log(speechPath);
  const text = fs.readFileSync(speechPath, 'utf8'); // this is meant to verify the file upload feature and should only be used on text files.
  console.log(text);
  const [respPath, speechChat, respChat] = logic.genResp(req.body.accent, req.body.scenario, speechPath);
  res.status(200); // TODO: figure out in what form should the response audio be sent back to client.
});

app.listen(8000);
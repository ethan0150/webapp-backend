// @deno-types="npm:@types/express@4.17.15"
import express, { Request, Response } from "npm:express@4.21.1";
// @deno-types="npm:@types/multer"
import multer from "npm:multer2"
import * as logic from './logic.ts'
//import * as model from './model.ts';
import "jsr:@std/dotenv/load";
import { Scenario } from "./model.ts";

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static("uploads"));
app.use(express.static("downloads"));

app.get("/", (_req: Request, res: Response ) => {
  res.send("Welcome to the Dinosaur API!");
  // TODO: send frontend (index.html etc.)
});

app.get("/prev_chat/:scenario", async(req: Request, res: Response) => {
  res.status(200).send(await logic.getChat(req.params.scenario as Scenario));
});

app.post("/speech", upload.single("speech"), async(req: Request, res: Response) => {
  const accent: string = req.body.accent;
  const scenario: string = req.body.scenario;
  const speechPath = req.file?.path;

  if (speechPath) {
    try {
      const content = await logic.genResp(accent, scenario, speechPath);
      
      res.status(200).send({
        content
      });

    } catch (error) {
      console.error("Error in processing response:", error);
      res.status(500).send("Error generating response.");
    }
  } else {
    res.status(400).send("No file uploaded");
  }
});



app.listen(8000);
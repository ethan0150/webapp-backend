import * as logic from '../logic.ts'
import { Scenario } from "../model.ts";

Deno.test(
    "Start Chatting", async () => {
        let input: string | null = '';
        await logic.deleteAllChat();
        await logic.initChat();
        while((input = prompt("Say something:")) != null){
            const respText = await logic.callChat(input, Scenario.daily);
            console.log(respText);
        }
    }
);
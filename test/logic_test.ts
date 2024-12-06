import "jsr:@std/dotenv/load";
import * as logic from '../logic.ts'
import { ChatEntry, Role, Scenario } from "../model.ts";

Deno.test(
    "DB read/write", async () => {
        await logic.deleteAllChat();
        const entries: ChatEntry[] = [
            new ChatEntry(Role.System, '1234567890'),
            new ChatEntry(Role.User, 'rweqqwrewrqe'),
            new ChatEntry(Role.Assistant, 'jhtjth'),
            new ChatEntry(Role.User, 'rweqqw876ewrqe')
        ];
        for(let entry of entries){
            await logic.addChat(Scenario.daily, entry);
        }
        console.log(await logic.getChat(Scenario.daily, true));
        await logic.deleteAllChat();
    }
);
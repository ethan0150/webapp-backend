import { Buffer } from "node:buffer";
import { ChatEntry, Role, Scenario, Accent, SystemPrompt} from "./model.ts";
import * as fs from 'node:fs';
import path from "node:path";
import { SpeechClient } from "npm:@google-cloud/speech";
import { TextToSpeechClient } from "npm:@google-cloud/text-to-speech";
import Groq from "npm:groq-sdk"
import Prisma from '@prisma/client'
const { PrismaClient } = Prisma;
const prisma = await new PrismaClient();
const groq = new Groq();

export async function genResp(accent: string, scenario: string, speechPath: string): Promise<[string, ChatEntry, ChatEntry]>
{
    const speechText: string = await callSTT(speechPath);
    const respText: string = await callChat(speechText, scenario as Scenario);
    const respPath: string = await callTTS(respText, accent);
    return [respPath, new ChatEntry(Role.User, speechText), new ChatEntry(Role.Assistant, respText)];
}

async function callSTT(speechPath: string) {
    const speechClient = new SpeechClient();
    try {
        await fs.promises.mkdir('uploads', { recursive: true });

        const publicPath = path.resolve("uploads", path.basename(speechPath));
        await fs.promises.rename(speechPath, publicPath);

        const audioContent = await fs.promises.readFile(publicPath);
    
        const [response] = await speechClient.recognize({
            audio: {
                content: audioContent,
            },
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 44100,
                languageCode: "en-US",
                audioChannelCount: 2,
            },
        });
    
        const transcription = await response.results
            ?.map((result) => result.alternatives?.[0].transcript)
            .join("\n");
    
        return transcription || ""; 
    } catch (error) {
        console.error("Speech-to-Text Error:", error);
        throw new Error("Error processing the speech file.");
    }
}
  

export async function callChat(speechText: string, scenario: Scenario): Promise<string>
{   
    const newChat = new ChatEntry(Role.User, speechText);
    let chatHistory = await getChat(scenario, true);
    chatHistory.push(newChat);
    const chatCompletion = await groq.chat.completions.create({
        "messages": chatHistory,
        "model": "llama3-8b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "stop": null
    });
    await addChat(scenario, newChat);
    const respText = chatCompletion.choices[0].message.content;
    if (respText === null) return "";
    await addChat(scenario, new ChatEntry(Role.Assistant, respText));
    return respText; // TODO: This should return the response text from GPT
}

async function callTTS(respText: string, accent: string): Promise<string> {
    const client = new TextToSpeechClient();
    try {
        const [response] = await client.synthesizeSpeech({
            input: { text: respText },
            voice: { languageCode: accent, ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" },
        });
    
        const uploadsDir = path.resolve("downloads");
        await fs.promises.mkdir(uploadsDir, { recursive: true });
    
        const fileName = `output-${Date.now()}.mp3`;
        const filePath = path.join(uploadsDir, fileName);
  
        fs.writeFile(filePath, response.audioContent as Buffer, function (err) {
            if (err) console.log(err);
        });
  
        return `http://localhost:8000/${fileName}`;
    } catch (error) {
        console.error("Error in Text-to-Speech:", error);
        throw new Error("Error generating audio content.");
    }
}

export async function getChat(scenario: Scenario, sysPrompt: boolean=false): Promise<ChatEntry[]>
{
    const entries = await prisma.chat.findMany({
        where: {
            scenario: scenario
        }
    })
    let chatEntries: ChatEntry[] = [];
    for (let entry of entries){
        if(!sysPrompt && entry.role === Role.System) continue;
        chatEntries.push(new ChatEntry(entry.role as Role, entry.content));
    }
    return chatEntries; // TODO: This should return all the previous chat of the given scenario in chronological order 
}

export async function addChat(scenario: Scenario, entry: ChatEntry){
    await prisma.chat.create({
        data: {
            scenario: scenario,
            role: entry.role,
            content: entry.content
        }
    });
    return;
}

export async function deleteAllChat() {
    await prisma.chat.deleteMany({});
    return;
}

export async function initChat(){
    await prisma.chat.createMany({
        data: [
            {
                role: Role.System,
                content: SystemPrompt[Scenario.daily],
                scenario: Scenario.daily
            },
            {
                role: Role.System,
                content: SystemPrompt[Scenario.Interview],
                scenario: Scenario.Interview
            },
            {
                role: Role.System,
                content: SystemPrompt[Scenario.Travel],
                scenario: Scenario.Travel
            }
        ]
    });
    return;
}
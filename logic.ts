import { Buffer } from "node:buffer";
import { ChatEntry } from "./model.ts";
import * as fs from 'node:fs';
import path from "node:path";
import { SpeechClient } from "npm:@google-cloud/speech";
import { TextToSpeechClient } from "npm:@google-cloud/text-to-speech";

export async function genResp(accent: string, scenario: string, speechPath: string): Promise<[string, ChatEntry, ChatEntry]>
{
    const speechText: string = await callSTT(speechPath);
    const respText: string = await callChat(speechText, scenario);
    const respPath: string = await callTTS(respText, accent);
    return [respPath, new ChatEntry(speechText, true), new ChatEntry(respText, false)];
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
  

function callChat(speechText: string, scenario: string): string
{   
    console.log("callChat "+speechText)

    return "Wow! It is really cool!"; // TODO: This should return the response text from GPT
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

export function getChat(scenario: string): ChatEntry[]
{
    return []; // TODO: This should return all the previous chat of the given scenario in chronological order 
}

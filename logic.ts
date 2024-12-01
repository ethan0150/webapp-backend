import { ChatEntry } from "./model.ts";
export function genResp(accent: string, scenario: string, speechPath: string): [string, ChatEntry, ChatEntry]
{
    const speechText: string = callSTT(speechPath);
    const respText: string = callChat(speechText, scenario);
    const respPath: string = callTTS(respText, accent);
    return [respPath, new ChatEntry(speechText, true), new ChatEntry(respText, false)];
}

function callSTT(speechPath: string): string
{
    return ""; // TODO: This should return the text given by Google STT
}

function callChat(speechText: string, scenario: string): string
{
    return ""; // TODO: This should return the response text from GPT
}

function callTTS(respText: string, accent: string): string
{
    return ""; // TODO: This should return the path to the audio file given by Google TTS
}

export function getChat(scenario: string): ChatEntry[]
{
    return []; // TODO: This should return all the previous chat of the given scenario in chronological order 
}
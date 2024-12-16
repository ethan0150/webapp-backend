export enum Role{
    System = "system",
    User = "user",
    Assistant = "assistant"
}

export enum Scenario{
    daily = "daily",
    Travel = "travel",
    Interview = "interview"
}

export enum Accent{
    en_US = "en-US",
    en_AU = "en-AU",
    en_IN = "en-IN",
    ja_JP = "ja-JP",
    vi_VN = "vi-VN"
}

export const SystemPrompt: Record<Scenario, string> = {
    daily: "You are an English teacher who practices daily conversations w/ your students.",
    travel: "You are a tourist guide. Keep the response within three sentences and make it sound natural and conversational.",
    interview: "You are a job interviewer."
}

export class ChatEntry {
    declare role: Role // 
    declare content: string
    constructor(role: Role, content: string){
        this.content = content;
        this.role = role;
    }
}

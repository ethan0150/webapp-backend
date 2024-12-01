
export class ChatEntry {
    declare text: string
    declare side: boolean // true: user false: GPT
    constructor(text: string, side: boolean){
        this.side = side;
        this.text = text;
    }
}

import Attachment from "./Attachment";
import {MessageAttachment} from "@slack/types";

export default class Attachments {
    private attachments: Attachment[] = [];

    push(attachment: Attachment) {
        this.attachments.push(attachment);
    }

    get(): MessageAttachment[] {
        return this.attachments.map(attachment => attachment.get());
    }
}
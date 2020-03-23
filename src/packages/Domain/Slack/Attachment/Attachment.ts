import {MessageAttachment} from "@slack/types"
import Fields from "./Fields/Fields";
import Status from "../Status/Status";

export default abstract class Attachment {
    protected readonly attachment: MessageAttachment;

    public constructor(protected status: string) {
        const color = (new Status(status)).getColor();
        this.attachment = {color, fields: this.createFields().get()}
    }

    public get(): MessageAttachment {
        return this.attachment;
    }

    protected abstract createFields(): Fields;
}
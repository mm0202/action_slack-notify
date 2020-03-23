import {IncomingWebhookSendArguments} from "@slack/webhook";
import Attachments from "../Attachment/Attachments";
import Status from "../Status/Status";
import {MessageAttachment} from "@slack/types";

type CustomPayloadMode = "overwrite" | "merge";
type CustomAttachmentMode = "overwrite" | "prepend" | "append";

export default class PayloadFactory {
    constructor(
        private readonly status: string,
        private readonly attachments: Attachments,
        private readonly customPayload: IncomingWebhookSendArguments,
        private readonly customPayloadMode: CustomPayloadMode,
        private readonly customAttachmentMode: CustomAttachmentMode
    ) {
    }

    create(): IncomingWebhookSendArguments {
        if (!this.customPayload.text) {
            this.customPayload.text = `${(new Status(this.status).getIcon())}Workflow is ${this.status.toLowerCase()}!`;
        }

        return  this.createPayload();
    }

    private createPayload(): IncomingWebhookSendArguments {
        const payload: IncomingWebhookSendArguments = this.customPayload ? {...this.customPayload} : {};
        if (this.customPayloadMode === "overwrite") {
            return payload;
        }
        if (!this.attachments) {
            return payload;
        }

        payload.attachments = this.createAttachments();
        return payload;
    }

    private createAttachments(): MessageAttachment[] {
        if (!this.customPayload.attachments) {
            return this.attachments.get();
        }

        if (this.customAttachmentMode === "prepend") {
            return this.customPayload.attachments.concat(this.attachments.get());
        }

        if (this.customAttachmentMode === "append") {
            return this.attachments.get().concat(this.customPayload.attachments);
        }

        return [...this.customPayload.attachments];
    }
}
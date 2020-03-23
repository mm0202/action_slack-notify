import * as core from '@actions/core';
import Attachments from "./packages/Domain/Slack/Attachment/Attachments";
import VariablesCheckAttachment from "./packages/Domain/Slack/Attachment/VariablesCheckAttachment";
import DefaultAttachment from "./packages/Domain/Slack/Attachment/DefaultAttachment";
import {
    IncomingWebhook, IncomingWebhookDefaultArguments,
    IncomingWebhookSendArguments
} from "@slack/webhook";
import PayloadFactory from "./packages/Domain/Slack/Payload/PayloadFactory";

type Result = {
    response: {},
    request: {
        defaults: IncomingWebhookDefaultArguments,
        payload: IncomingWebhookSendArguments
    }
} | boolean

export default class Main {
    private readonly status: string;
    private readonly style: string;
    private readonly payload: IncomingWebhookSendArguments;
    private readonly customPayloadMode: any;
    private readonly customAttachmentMode: any;

    constructor() {
        this.style = core.getInput('style');
        this.payload = JSON.parse(core.getInput('payload'));
        this.customPayloadMode = core.getInput('customPayloadMode');
        this.customAttachmentMode = core.getInput('customAttachmentMode');
        this.status = core.getInput('status');
    }

    async execute(): Promise<Result> {
        try {
            const {SLACK_WEBHOOK_URL} = process.env;
            if (!SLACK_WEBHOOK_URL) {
                return false;
            }

            const defaults = {
                username: "github",
                icon_url: "https://i.gyazo.com/9347bff1b87084be4c5f1e5650d82a48.png",
            };

            const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL, defaults);
            const payload = new PayloadFactory(
                this.status,
                this.createAttachments(),
                this.payload,
                this.customPayloadMode,
                this.customAttachmentMode
            ).create();
            const response = await webhook.send(payload);

            const result = {
                response,
                request: {
                    defaults,
                    payload
                }
            };

            core.setOutput("result", JSON.stringify(result));

            return result
        } catch (error) {
            core.setFailed(error.message);
        }
        return false;
    }

    private createAttachments(): Attachments {
        const attachments = new Attachments();
        if (this.style === "default") {
            attachments.push(new DefaultAttachment(this.status));
            return attachments;
        }

        if (this.style === "variables-check") {
            attachments.push(new VariablesCheckAttachment(this.status));
            return attachments;
        }

        throw new Error(`set one of default or variables-check for style].`)
    }
}

const main = new Main();
main.execute();
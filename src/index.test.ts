import dotenv from "dotenv";
import Main from "./index";
import Attachments from "./packages/Domain/Slack/Attachment/Attachments";
import DefaultAttachment from "./packages/Domain/Slack/Attachment/DefaultAttachment";
import PayloadFactory from "./packages/Domain/Slack/Payload/PayloadFactory";
import {InputOptions} from "@actions/core";

jest.mock('@actions/core', () => ({
    getInput: (name: string, options?: InputOptions): string => {
        console.log(`getInput / name: ${name}, option: ${JSON.stringify(options)}`);

        const inputs: { [key: string]: string } = {
            style: "default",
            payload: '{"text": "通知テスト成功"}',
            customPayloadMode: "merge",
            customAttachmentMode: "append",
            status: "Success"
        };
        return inputs[name];
    },
    setFailed: (message: string): void => {
        console.log(`setFailed / message: ${message}`)
    },
    setOutput: (name: string, value: string): void => {
        console.log(`setOutput / message: ${name}, value: ${value}`)
    }
}));

describe("Mainクラスのテスト", () => {
    let main: Main;
    const defaultStatus = "Success";

    beforeAll(() => {
        dotenv.config();
    });

    beforeEach(() => {
        const {SLACK_WEBHOOK_URL} = process.env;
        if (!SLACK_WEBHOOK_URL) {
            throw new Error("There is no SLACK_WEBHOOK_URL")
        }

        main = new Main();
    });

    test("通知成功", async () => {
        const attachments = new Attachments();
        attachments.push(new DefaultAttachment(defaultStatus));
        const payload = new PayloadFactory(
            defaultStatus,
            attachments,
            {text: "通知テスト成功"},
            "merge",
            "append"
        );
        const result = await main.execute();
        expect(result).toBeInstanceOf(Object);
        if (typeof result === "object") {
            expect(Object.keys(result.request)).toEqual(["defaults", "payload"]);
            expect(result.response).toEqual({"text": "ok"});
            expect(result.request.payload).toEqual(payload.create());
        }
    });
});
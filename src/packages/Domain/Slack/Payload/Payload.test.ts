import dotenv from "dotenv";
import {IncomingWebhookSendArguments} from "@slack/webhook";
import PayloadFactory from "./PayloadFactory";
import Attachments from "../Attachment/Attachments";
import DefaultAttachment from "../Attachment/DefaultAttachment";
import VariablesCheckAttachment from "../Attachment/VariablesCheckAttachment";

describe("Payloadクラスのテスト", () => {
    const defaultStatus = "Success";
    const defaultCustomPayload1: IncomingWebhookSendArguments = {text: "success?"};

    beforeAll(() => {
        dotenv.config();
    });

    describe("スタイル指定機能のチェック", () => {
        test("変数チェックスタイルの結果が適正", async () => {
            const attachments = new Attachments();
            attachments.push(new VariablesCheckAttachment(defaultStatus));
            const payload = new PayloadFactory(
                defaultStatus,
                attachments,
                defaultCustomPayload1,
                "merge",
                "append"
            );

            const generatedPayload = payload.create();

            expect(Object.keys(generatedPayload)).toContain("attachments");
            expect(generatedPayload.attachments).toBeTruthy();
            expect(generatedPayload.attachments).toHaveLength(1);
            if (generatedPayload.attachments) {
                expect(generatedPayload.attachments[0].fields).toBeTruthy();
                if (generatedPayload.attachments[0].fields) {
                    expect(generatedPayload.attachments[0].fields[0].title).toEqual(":point_right: *job*");
                }
            }
        });

        test("デフォルトスタイルの結果が適正", async () => {
            const attachments = new Attachments();
            attachments.push(new DefaultAttachment(defaultStatus));
            const payload = new PayloadFactory(
                defaultStatus,
                attachments,
                defaultCustomPayload1,
                "merge",
                "append"
            );

            const generatedPayload = payload.create();

            expect(Object.keys(generatedPayload)).toContain("attachments");
            expect(generatedPayload.attachments).toBeTruthy();
            expect(generatedPayload.attachments).toHaveLength(1);
            if (generatedPayload.attachments) {
                expect(generatedPayload.attachments[0].fields).toBeTruthy();
                if (generatedPayload.attachments[0].fields) {
                    expect(generatedPayload.attachments[0].fields[0].title).toEqual("*Repository*");
                }
            }
        });
    });

    describe("カスタムpayloadのモードチェック", () => {
        let attachments: Attachments;
        const defaultCustomPayload2: IncomingWebhookSendArguments = {
            text: "custom text",
            attachments: [{
                color: "warning",
                fields: [{
                    title: "test title",
                    value: "test value"
                }]
            }]
        };

        beforeEach(() => {
            attachments = new Attachments();
            attachments.push(new VariablesCheckAttachment(defaultStatus));
        });

        describe("merge mode", () => {
            test("check append attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "merge",
                    "append"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload.text).toEqual(defaultCustomPayload2.text);
                expect(generatedPayload.attachments).toHaveLength(2);
                if (generatedPayload.attachments && defaultCustomPayload2.attachments) {
                    expect(generatedPayload.attachments[0]).not.toEqual(defaultCustomPayload2.attachments[0]);
                    expect(generatedPayload.attachments[1]).toEqual(defaultCustomPayload2.attachments[0]);
                }
            });

            test("check prepend attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "merge",
                    "prepend"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload.text).toEqual(defaultCustomPayload2.text);
                expect(generatedPayload.attachments).toHaveLength(2);
                if (generatedPayload.attachments && defaultCustomPayload2.attachments) {
                    expect(generatedPayload.attachments[0]).toEqual(defaultCustomPayload2.attachments[0]);
                    expect(generatedPayload.attachments[1]).not.toEqual(defaultCustomPayload2.attachments[0]);
                }
            });
            test("check overwrite attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "merge",
                    "overwrite"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload.text).toEqual(defaultCustomPayload2.text);
                expect(generatedPayload.attachments).toEqual(defaultCustomPayload2.attachments);
            });
        });


        describe("overwrite mode", () => {
            test("check append attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "overwrite",
                    "append"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload).toEqual(defaultCustomPayload2);
            });

            test("check prepend attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "overwrite",
                    "prepend"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload).toEqual(defaultCustomPayload2);
            });

            test("check overwrite attachments", async () => {
                const payload = new PayloadFactory(
                    defaultStatus,
                    attachments,
                    defaultCustomPayload2,
                    "overwrite",
                    "overwrite"
                );

                const generatedPayload = payload.create();

                expect(generatedPayload).toEqual(defaultCustomPayload2);
            });
        })
    })
});
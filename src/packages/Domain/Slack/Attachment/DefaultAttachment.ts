import * as github from "@actions/github";
import Attachment from "./Attachment";
import Fields from "./Fields/Fields";

export default class DefaultAttachment extends Attachment {
    protected createFields(): Fields {
        const context = github.context;
        const owner = context.repo.owner;
        const repo = context.repo.repo;
        const sha = context.sha;
        const htmlUrl = github?.context?.payload?.repository?.html_url || `https://github.com/${owner}/${repo}`;

        const fields = new Fields();
        const customFieldsPush = (title: string, value: string | undefined, short: boolean = true) => {
            fields.push(`*${title}*`, value, short);
        };

        if (htmlUrl && owner && repo) {
            customFieldsPush('Repository', `<${htmlUrl}|${owner}/${repo}>`);
        }
        customFieldsPush('Actor', context.actor);
        customFieldsPush('Event', context.eventName);
        customFieldsPush('Ref', String(context.ref));
        customFieldsPush('Workflow', String(context.workflow));
        customFieldsPush('Status', this.status);
        if (htmlUrl && sha) {
            customFieldsPush("Commit", `<${htmlUrl}/commit/${sha}|Click here> for details`);
            customFieldsPush("Action", `<${htmlUrl}/commit/${sha}/checks|Click here> for details`);
        }

        return fields;
    }
}
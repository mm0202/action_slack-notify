import * as github from "@actions/github";
import Attachment from "./Attachment";
import Fields from "./Fields/Fields";

export default class VariablesCheckAttachment extends Attachment {
    protected createFields(): Fields {
        const {
            HOME,
            GITHUB_WORKFLOW,
            GITHUB_RUN_ID,
            GITHUB_RUN_NUMBER,
            GITHUB_ACTION,
            GITHUB_ACTIONS,
            GITHUB_ACTOR,
            GITHUB_REPOSITORY,
            GITHUB_EVENT_NAME,
            GITHUB_EVENT_PATH,
            GITHUB_WORKSPACE,
            GITHUB_SHA,
            GITHUB_REF,
            GITHUB_HEAD_REF,
            GITHUB_BASE_REF
        } = process.env;

        const context = github.context;
        const issue = context.issue;
        const payloadIssue = context.payload.issue;
        const pullRequest = context.payload.pull_request;
        const repository = context.payload.repository;
        const repo = context.repo;

        const fields = new Fields();
        const customFieldsPush = (title: string, value: string | undefined) => {
            fields.push(`*<${title}>*`, value);
        };

        fields.push(':point_right: *job*', "--- *_from job_* ---", false);
        customFieldsPush('job.status', this.status);

        fields.push(':point_right: *github*', "--- *_from @actions/github package_* ---", false);
        customFieldsPush('github.context.action', context.action);
        customFieldsPush('github.context.actor', context.actor);
        customFieldsPush('github.context.ref', String(context.ref));
        customFieldsPush('github.context.sha', String(context.sha));
        customFieldsPush('github.context.workflow', String(context.workflow));
        customFieldsPush('github.context.eventName', context.eventName);

        customFieldsPush('github.context.repo.owner', String(repo.owner));
        customFieldsPush('github.context.repo.repo', String(repo.repo));

        customFieldsPush('github.context.issue.owner', issue.owner);
        customFieldsPush('github.context.issue.repo', issue.repo);
        customFieldsPush('github.context.issue.number', String(issue.number));

        customFieldsPush('github.context.payload.installation.id', String(context.payload.installation?.id));

        customFieldsPush('github.context.payload.sender.type', String(context.payload.sender?.type));

        customFieldsPush('github.context.payload.issue.action', String(context.payload.action));
        customFieldsPush('github.context.payload.issue.body', String(payloadIssue?.body));
        customFieldsPush('github.context.payload.issue.html_url', String(payloadIssue?.html_url));
        customFieldsPush('github.context.payload.issue.number', String(payloadIssue?.number));

        customFieldsPush('github.context.payload.pull_request.number', String(pullRequest?.number));
        customFieldsPush('github.context.payload.pull_request.html_url', String(pullRequest?.html_url));
        customFieldsPush('github.context.payload.pull_request.body', String(pullRequest?.body));

        customFieldsPush('github.context.payload.repository.html_url', String(repository?.html_url));
        customFieldsPush('github.context.payload.repository.full_name', String(repository?.full_name));
        customFieldsPush('github.context.payload.repository.name', String(repository?.name));
        customFieldsPush('github.context.payload.repository.owner.name', String(repository?.owner.name));
        customFieldsPush('github.context.payload.repository.owner.login', String(repository?.owner.login));

        fields.push(':point_right: *environment variables*', "--- *_from default environment variables_* ---", false);
        customFieldsPush("HOME", HOME);
        customFieldsPush("GITHUB_WORKFLOW", GITHUB_WORKFLOW);
        customFieldsPush("GITHUB_RUN_ID", GITHUB_RUN_ID);
        customFieldsPush("GITHUB_RUN_NUMBER", GITHUB_RUN_NUMBER);
        customFieldsPush("GITHUB_ACTION", GITHUB_ACTION);
        customFieldsPush("GITHUB_ACTIONS", GITHUB_ACTIONS);
        customFieldsPush("GITHUB_ACTOR", GITHUB_ACTOR);
        customFieldsPush("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
        customFieldsPush("GITHUB_EVENT_NAME", GITHUB_EVENT_NAME);
        customFieldsPush("GITHUB_EVENT_PATH", GITHUB_EVENT_PATH);
        customFieldsPush("GITHUB_WORKSPACE", GITHUB_WORKSPACE);
        customFieldsPush("GITHUB_SHA", GITHUB_SHA);
        customFieldsPush("GITHUB_REF", GITHUB_REF);
        customFieldsPush("GITHUB_HEAD_REF", GITHUB_HEAD_REF);
        customFieldsPush("GITHUB_BASE_REF", GITHUB_BASE_REF);

        return fields;
    }
}
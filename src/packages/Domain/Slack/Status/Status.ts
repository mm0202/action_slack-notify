export default class Status {
    static STATUS_SUCCESS = "success";
    static STATUS_FAILURE = "failure";
    static STATUS_CANCELLED = "cancelled";

    constructor(private readonly status: string) {
        this.status = status.toLowerCase();
    }

    getColor() {
        const status = this.status.toLowerCase();
        if (status === Status.STATUS_SUCCESS) {
            return "good";
        }
        if (status === Status.STATUS_FAILURE) {
            return "danger";
        }
        if (status === Status.STATUS_CANCELLED) {
            return "warning";
        }
        return "";
    }

    getIcon() {
        const status = this.status.toLowerCase();
        if (status === Status.STATUS_SUCCESS) {
            return ":heavy_check_mark:";
        }
        if (status === Status.STATUS_FAILURE) {
            return ":exclamation:";
        }
        if (status === Status.STATUS_CANCELLED) {
            return ":grey_exclamation:";
        }
        return "";
    }
}
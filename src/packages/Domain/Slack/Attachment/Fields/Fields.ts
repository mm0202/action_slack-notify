export interface InterfaceField {
    title: string,
    value: string,
    short?: boolean
}

export default class Fields {
    private readonly fields: InterfaceField[] = [];

    get() {
        return this.fields;
    }

    push(title: string, value: string | undefined, short = true): boolean {
        if (!value || value === "undefined") {
            return false;
        }

        this.fields.push({title, value, short});

        return true;
    }
}
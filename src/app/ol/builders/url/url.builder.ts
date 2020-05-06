
interface Param { key: string; value: string; }

export default class URLBuilder {

    base: string;
    params: Param[];

    constructor(base?: string) {
        if (base) { this.base = base; }
        this.params = [];
    }

    setParam(key: string, value: string): URLBuilder {
        let exists = false;
        for (const index in this.params) {
            if (this.params[index].key === key){
                this.params[index].value = value;
                exists = true;
                break;
            }
        }
        if (!exists) { this.params.push({ key, value }); }

        return this;

    }

    setBase(url: string): URLBuilder{
        this.base = url;
        return this;
    }

    getBase(): string { return this.base; }

    toString(): string {
        let query = '';
        // tslint:disable-next-line: forin
        for (const index in this.params) {
            query += '&';
            query += this.params[index].key;
            query += '=';
            query += this.params[index].value;
        }
        let fullUrl = this.base + '?' + query;
        return fullUrl.replace('?&', '?');

    }

}
import axios from 'axios';
import { Registry, RegistryResult } from "../registry";

export class KBA extends Registry {

    async query(key:string) {
        const results:RegistryResult[] = [];
        console.log('querying %s with %s', this._register, key);
        const response = await axios.get(`https://kb-prepare.k-r.ch/api/${this._register}?search=${encodeURIComponent(key)}`);
        if (response.status !== 200) {
            return results;
        }
        const json:any = response.data;
        let label: string;
        switch (this._register) {
            case 'places':
                label = 'placeName_full';
                break;
            case 'terms':
                label = 'fullLabel';
                break;
            default:
                label = 'persName_full';
                break;
        }
        json.data.forEach((item:any) => {
            const type = this._register === 'actors' ? item['authority_type'] : this._register;
            const result:RegistryResult = {
                type: type,
                register: this._register,
                id: item['full-id'],
                label: item[label],
                link: `https://kb-prepare.k-r.ch/${this._register}/${item.id}`
            };
            results.push(result);
        });
        return results;
    }

    format(item: RegistryResult) {
        switch (item.type) {
            case 'person':
                return `<persName ref="${item.id}">$TM_SELECTED_TEXT</persName>`;
            case 'organisation':
                return `<orgName ref="${item.id}">$TM_SELECTED_TEXT</orgName>`;
            case 'places':
                return `<placeName ref="${item.id}">$TM_SELECTED_TEXT</placeName>`;
            case 'terms':
                return `<term ref="${item.id}">$TM_SELECTED_TEXT</term>`;
        }
    }
}
import axios from 'axios';
import { Registry, RegistryResultItem } from "../registry";

/**
 * Uses Usaybia
 */
export class Srophe extends Registry {

    get name() {
        return 'Srophe';
    }
    
    async query(key:string) {
        const results:RegistryResultItem[] = [];
        let filter;
        switch (this._register) {
            case 'places':
                filter = 'placeName';
                break;
            case 'terms':
                filter = 'term';
                break;
            case 'organisations':
                filter = 'CorporateBody';
                break;
            default:
                filter = 'persName';
                break;
        }
        const response = await axios.get(`https://usaybia.net/api/search/${filter}?q=${encodeURIComponent(key)}`);
        if (response.status !== 200) {
            return {
                totalItems: 0,
                items: []
            };
        }
        const json:any = response.data;
        json.results.forEach((item:any) => {
            if ((this._register === 'places' )) {
                const result:RegistryResultItem = {
                    register: this._register,
                    id: item.id,
                    label: item.placeName
                }; 
                results.push(result);       
            } else if ((this._register === 'term' )) {
                const result:RegistryResultItem = {
                    register: this._register,
                    id: item.id,
                    label: item.term
                };   
                results.push(result);     
            } else {
                const result:RegistryResultItem = {
                    register: this._register,
                    id: item.id,
                    label: item.persName
                }; 
                results.push(result);
            }
        });
        
        return {
            totalItems: json.results.length,
            items: results
        };
    }

}
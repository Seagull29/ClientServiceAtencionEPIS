import { FetchData  } from "@config/fetchData";
import { links } from "@config/util";

export class Estudiante {

    static readonly #endpoint : string = 'estudiantes';
    static #axiosInstance : any = new FetchData(links.apiDomain);

    static search = async (query : string, filter : string) : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/search`,
            query,
            filter
        });
        return data.data;
    }

    static add = async ({ ...body }) : Promise<any | null> => {
        const data = await this.#axiosInstance.postRequest({
            requestUrl: `${this.#endpoint}/add`,
            ...body
        });
        
        return data;
    }


}


/*
const main = async () => {
    //const fetchting : FetchData = new FetchData('http://localhost:5000/api/');
    const data = await Estudiante.search(
        '018100264a',
        'codigo'
    );

   
    

    console.log(data);
}

main();

*/
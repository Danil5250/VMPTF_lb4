import api from "../../main-api/api.ts";
import axios from "axios";


const baseUrl = 'autorepair'

export const getAutorepairById = async (id: string) => {
    try {
        const result = await api.get(`${baseUrl}/byId/${id}`)
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.log(`${error} occurred receiving the autorepair`);
    }
}

export const getAutorepairServicesById = async (id: number) => {
    try{
        const result = await api.get(`${baseUrl}/services/${id}`)
        console.log(result.data);
        return result.data;
    }
    catch (error) {
        console.log(`${error} occurred receiving the autorepair`);
    }
}

export const getFilteredAutorepairs = async(
                                    searchQuery: string | null,
                                    cityFilter: string | null,
                                            specialization: string,
                                            workingDays: string[],
                                            sortBy: string,
                                    sortOrder: string,
                                            limit:number,
                                            offset: number
                                    ) => {
    try {
        // console.log("specialization:", specialization)
        // console.log("specialization:", specialization ? [specialization] : undefined)
        // console.log("workingDays:", workingDays)
        // console.log("workingDays:", workingDays.length > 0 ? workingDays : undefined)
        // const response = await api.get(`${baseUrl}`, {
        //     params: {
        //         name: searchQuery || undefined,
        //         city: cityFilter || undefined,
        //         specialization: specialization ? [specialization] : undefined,
        //         workingDays: workingDays.length > 0 ? workingDays : undefined,
        //         sortBy,
        //         sortOrder: sortOrder.toUpperCase(),
        //         limit,
        //         offset
        //     }
        // });

        const searchParams = new URLSearchParams();

        if (searchQuery) searchParams.append('name', searchQuery);
        if (cityFilter) searchParams.append('city', cityFilter);
        if (specialization) searchParams.append('specialization', specialization);

        workingDays.forEach(day => {
            searchParams.append('workingDays', day);
        });

        searchParams.append('sortBy', sortBy);
        searchParams.append('sortOrder', sortOrder.toUpperCase());
        searchParams.append('limit', limit.toString());
        searchParams.append('offset', offset.toString());

        const url = `${baseUrl}?${searchParams.toString()}`;
        console.log('Final URL:', url);

        const response = await api.get(url);
        return response.data;
    }
    catch (error) {
        console.log(`${error} occurred receiving filtered autorepair`);
    }
}

export const generateAutorepairRecord = async (autorepairId: number) => {


    const response = await api.get(
        `${baseUrl}/getAutorepairsReportById/${autorepairId}`,
        { responseType: "blob" }
    );

    console.log(response);

    return response.data;
};




export const getAutorepairStatistic = async () => {
    return await api.get(`${baseUrl}/allAutorepairsStatistics`)
}





export const getAutorepairCarSpecialization = async (autorepairId: number,
                                                     params?: {
                                                         brand?: string;
                                                         model?: string;
                                                         engineType?: string;
                                                     }) => {

    const query = new URLSearchParams(
        Object.entries(params || {}).filter(([_, v]) => v != null) as any
    ).toString();

    return await api.get(`${baseUrl}/autorepairSpecializations/${autorepairId}?${query}`)

}

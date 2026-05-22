export class RetrieveAutorepairOptions {
    name?: string;
    city?: string;
    specialization?: string[];
    workingDays?: string[];
    sortBy?: 'name' | 'ranking' | 'workers_amount';
    sortOrder?: 'ASC' | 'DESC';
    limit?: string;
    offset?: string;
}

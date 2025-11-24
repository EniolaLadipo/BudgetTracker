export type Transaction = {    
    id: number,
    item: string,
    category: string,
    amount: number,
    created_at: string,
};

export type BarChartData = {
    category: string,
    [key: string]: string | number
};
export interface DateFormat {
    year: number,
    month: number,
    day: number
}
export interface AutoSelectFormat {
    label: string,
    value: string
}
export interface PlanificareModel {
    UID: string,
    PARENT: string,
    DATA_PLAN: DateFormat | string,
    NR_PLAN: number,
    DENUMIRE: string,
    POZITIE_TAMBUR: number,
    COD_SORTIMENT: AutoSelectFormat | string,
    POZITIE_BOBINA: number,
    COD_PRODUS: AutoSelectFormat | string,
    CLIENT: AutoSelectFormat | string,
    NR_COMANDA: string,
    CANT_PLANIFICAT: number,
    TIP: string
}

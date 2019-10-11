export interface nomlModel {
    COD: string,
    NUME: string,
    TAXE: string,
    OBS: string,
    PAR: string,
    VALOARE: number,
    PRODUS: string,
    DATA_LAN: { year: number, month: number, day: number },
    DATA_INCH: { year: number, month: number, day: number },
    CANT: number,
    CONTRACT: string,
    CC: string,
    PARTENER: string | { value: string, label: string },
    COD_PROD: string,
    TIP_ACT: string,
    NR_ACT: string,
    DATA_ACT: string,
    LL_AA: string,
    STARE: string,
    RETETAR: string
}








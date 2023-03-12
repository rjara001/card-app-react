
export interface ISummaryContext {
    summary: ISummary
    updateValue: (newValue: ISummary) => void;
}
export interface ISummary {
    bad:number
    ok:number
}
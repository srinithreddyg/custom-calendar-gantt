/// <reference types="react" />
export declare type field = {
    name: string;
    value: any;
};
export declare type Task = {
    startDate: string;
    endDate: string;
    tooltip: any;
    color: string;
    tableColumns: string[];
};
declare type props = {
    tasks: Task[];
    numOfMonthsDisplayed: number;
    cellsPerMonth: number;
    tableHeader: string;
};
export declare const GanttChart: (props: props) => JSX.Element;
export {};

import MyArray from "../models/MyArray";
import CSVFile from "./../models/CSVFile";
import Queue from "./../models/Queue";

/** Set current process status */
declare function setStatus(stat: boolean): boolean;

/** Interupt current process */
declare function interupt(): void;

/** Stop current process */
declare function stopProcess(): void;

/** Show last porcess report */
declare function showReport(): void;

/** Update current UI frequently */
declare function updateUI(index?: number, phone?: string): void;

/** Measure and Show current progress */
declare function showProgress(queue: Queue, index: number): void;

/** Check Current status to conclude current process will be started or not */
export function checkStatus(): Promise<boolean>;

/** Load the recepient data */
export function loadRecipient(csvFile: CSVFile): void;

/** Reloading recipients data */
export function reloadRecipient(): void;

/** Reset recipients data, and delete current loaded CSV file */
export function resetRecipient(): void;

/** Start sending process */
export function startProcess(): void;

/** Export data */
export function exportDataToFile(data: MyArray<any>, title: string): void
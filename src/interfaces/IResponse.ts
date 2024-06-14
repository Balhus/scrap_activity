import { Entry } from "src/entry/entry.model";
import { IEntry } from "./IEntry";

export interface IResponse{
    status: string;
    message: string; 
    data: Entry[] | IEntry[] | string
}
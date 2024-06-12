import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Entry extends Model<Entry>{
    @Column
    position: Number;

    @Column
    title: string;

    @Column
    points: Number;

    @Column
    num_comments: Number;
}
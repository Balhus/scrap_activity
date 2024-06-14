import { Column, Model, Table } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: 'tracking',
    freezeTableName: true
})
export class Tracking extends Model<Tracking>{
    @Column
    request_timestamp: Number;

    @Column
    action: string;

    @Column
    request_status: string;

    @Column
    request_message: string;

}
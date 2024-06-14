import { Column, Model, Table, CreatedAt, UpdatedAt, Unique, DataType } from "sequelize-typescript";

@Table
export class Entry extends Model<Entry>{
    @Column
    position: Number;

    @Unique
    @Column
    title: string;

    @Column
    points: Number;

    @Column
    num_comments: Number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: () => Date.now(),
    })
    @CreatedAt
    createdAt: Number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: () => Date.now(),
    })
    @UpdatedAt
    updatedAt: Number;
}
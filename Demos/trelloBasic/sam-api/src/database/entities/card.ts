import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'cards' })
export class Card {
    @PrimaryGeneratedColumn('int')
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    tableName: string;
}

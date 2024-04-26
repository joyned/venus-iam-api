import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('venus_system')
export class System {
    @PrimaryColumn()
    id?: number;

    @Column()
    version?: string;
}
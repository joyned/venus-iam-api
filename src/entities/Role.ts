import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;
}

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @Column({ name: 'last_update' })
    lastUpdate?: Date;

    @ManyToMany(() => Role, { eager: true })
    @JoinTable({ name: 'group_roles', joinColumn: { name: 'group_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' } })
    roles?: Role[];
}

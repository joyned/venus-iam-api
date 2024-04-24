import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @Column()
    email?: string;

    @Column()
    password?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @Column({ name: 'is_blocked' })
    isBlocked?: boolean;

    @ManyToMany(() => Group, { eager: true })
    @JoinTable({ name: 'user_groups', joinColumn: { name: 'user_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' } })
    groups?: Group[];

}
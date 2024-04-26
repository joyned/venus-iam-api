import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";


@Entity("client_allowed_url")
export class ClientAllowedUrl {

    @PrimaryGeneratedColumn()
    id?: string;

    @ManyToOne(() => Client, (client) => client.allowedUrls)
    @JoinColumn({ name: "client_id" })
    client?: Client;

    @Column()
    url?: string;
}
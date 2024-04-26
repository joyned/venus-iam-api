import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientAllowedUrl } from "./ClientAllowedUrl";

@Entity('clients')
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @Column()
    url?: string;

    @OneToMany(() => ClientAllowedUrl,
        (clientAllowedUrl) => clientAllowedUrl.client, { eager: true }
    )
    allowedUrls?: ClientAllowedUrl[]

    @Column({ name: "client_id" })
    clientId?: string;

    @Column({ name: "client_secret" })
    clientSecret?: string;

    @Column({ name: "created_at" })
    createdAt?: Date;
}
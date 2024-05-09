import { Group } from "../entities/Group";
import { executeQuery } from "./BaseRepository";

const INSERT = `INSERT INTO venus.client_group (client_id, group_id) VALUES ($1, $2)`;
const DELETE_BY_CLIENT_ID = `DELETE FROM venus.client_group WHERE client_id = $1`;

export default class ClientGroupRepository {


    async persist(clientId: string, clientGroups: Group[]) {
        clientGroups.forEach(async (clientGroup) => {
            await executeQuery(INSERT, [clientId, clientGroup.id]);
        });
    }

    async destroy(clientId: string) {
        await executeQuery(DELETE_BY_CLIENT_ID, [clientId]);
    }
}
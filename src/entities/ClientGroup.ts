export default class ClientGroup {
    declare clientId: string;
    declare groupId: string;

    constructor(data?: any) {
        if (data) {
            this.clientId = data.client_id;
            this.groupId = data.group_id;
        }
    }
}
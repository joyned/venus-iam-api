import { mock, MockProxy } from "jest-mock-extended";
import { Client } from "../../src/entities/Client";
import { ClientAllowedUrl } from "../../src/entities/ClientAllowedUrl";
import { ClientAllowedUrlRepository } from "../../src/repositories/ClientAllowedUrlRepository";
import { ClientRepository } from "../../src/repositories/ClientRepository";
import { ClientService } from "../../src/services/ClientService";

describe("ClientService", () => {
  let clientService: ClientService;
  let clientRepositoryMock: MockProxy<ClientRepository>;
  let clientAllowedUrlRepositoryMock: MockProxy<ClientAllowedUrlRepository>;

  beforeEach(() => {
    clientRepositoryMock = mock<ClientRepository>();
    clientAllowedUrlRepositoryMock = mock<ClientAllowedUrlRepository>();
    clientService = new ClientService(
      clientRepositoryMock,
      clientAllowedUrlRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find all clients", async () => {
    const clients: Client[] = [
      {
        id: "1",
        clientSecret: undefined as any,
        allowedUrls: [],
        createdAt: undefined as any,
        name: "client",
        url: "http://example.com",
        image: "http://example.com/image.png",
      },
    ];
    clientRepositoryMock.findAll.mockResolvedValue(clients);

    const result = await clientService.findAll();

    expect(clientRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(clients);
  });

  it("should find client by id", async () => {
    const client: Client = {
      id: "1",
      clientSecret: undefined as any,
      allowedUrls: [],
      createdAt: undefined as any,
      name: "client",
      url: "http://example.com",
      image: "http://example.com/image.png",
    };
    const allowedUrls: ClientAllowedUrl[] = [
      { clientId: "1", url: "http://example.com", clients: [client] },
    ];
    clientRepositoryMock.findById.mockResolvedValue(client);
    clientAllowedUrlRepositoryMock.findByClientId.mockResolvedValue(
      allowedUrls,
    );

    await clientService.findById("1");

    expect(clientRepositoryMock.findById).toHaveBeenCalledWith("1");
    expect(clientAllowedUrlRepositoryMock.findByClientId).toHaveBeenCalledWith(
      "1",
    );
  });
});

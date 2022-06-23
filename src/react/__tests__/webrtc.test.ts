import { WSTransport } from "../../network/wsTransport";
import { MockWS } from "../__mocks__/mockWSTransport";

describe("WSTransport", () => {
    let mockWS: MockWS;
    beforeEach(() => {
        mockWS = new MockWS("", [], 100);
    });

    afterEach(() => {
        mockWS.close();
    });

    it("should be able to create a connection", async () => {
        const altMockWs = new MockWS("", [], 400);
        const wsTransport = new WSTransport("", () => {return;}, () => altMockWs, () => {return;}, [], true, 5000, 1000, mockWS);
        const connected = await wsTransport.connect();
        expect(connected).toBe(true);

        // clean up
        altMockWs.close();
        wsTransport.disconnect();
    });

    it("should handle rtpCapabilties send message", async () => {
        let resolver: any;
        const altMockWs = new MockWS("", [], 400);
        const resPromise = new Promise<void>(resolve => {
            resolver = resolve;
        });
        const wsTransport = new WSTransport("", (_, data) => { resolver(data); }, () => altMockWs, () => {return;}, [], true, 5000, 1000, mockWS);
        const data = JSON.stringify({getRouterRtpCapabilities: {}});
        await wsTransport.send(data);
        const response = await resPromise;
        expect(JSON.stringify(response)).toEqual(JSON.stringify({response: "Got router capabilities"}));

        altMockWs.close();
        wsTransport.disconnect();
    });
});

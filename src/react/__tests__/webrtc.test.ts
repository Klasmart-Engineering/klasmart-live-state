import { WSTransport } from "../../network/wsTransport";
import { MockWS } from "../__mocks__/mockWSTransport";

describe("WSTransport", () => {
    const mockWS = new MockWS("", [], 100);

    it("should be able to create a connection", async () => {
        const wsTransport = new WSTransport("", () => {return;}, (url: string, protocols: string[]) => {return new MockWS(url, protocols, 400);}, () => {return;}, [], true, 5000, 1000, mockWS);
        const connected = await wsTransport.connect();
        expect(connected).toBe(true);
    });

    it("should handle rtpCapabilties send message", async () => {
        let resolver: any;
        const resPromise = new Promise<void>(resolve => {
            resolver = resolve;
        });
        const wsTransport = new WSTransport("", (_, data) => { resolver(data); }, (url: string, protocols: string[]) => {return new MockWS(url, protocols, 400);}, () => {return;}, [], true, 5000, 1000, mockWS);
        const data = JSON.stringify({getRouterRtpCapabilities: {}});
        await wsTransport.send(data);
        const response = await resPromise;
        expect(JSON.stringify(response)).toEqual(JSON.stringify({response: "Got router capabilities"}));
    });
});

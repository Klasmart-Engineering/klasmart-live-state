import { Store } from "redux";
import { State, Action } from "../ui";
import { SFU } from "./sfu";

export class WebRtcManager<ApplicationState = unknown> {
  private sfus = new Map<string, SFU>();
  public constructor(
    public readonly store: Store<ApplicationState, Action>,
    public readonly selector: (s: ApplicationState) => State
  ) {}

  private connectToSFU(url: string) {
    let sfu = this.sfus.get(url);
    if (!sfu) {
      sfu = new SFU(url);
      this.sfus.set(url, sfu);
    }
    return sfu;
  }

  public getSFU(): SFU {
    throw new Error("probably uses connectToSFU somehow???");
  }
}

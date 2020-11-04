import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedObjectSequence, SharedString } from "@fluidframework/sequence";
import { IMessage } from "../state/messageListManager";

export class MessageList extends DataObject {
  public messages!: SharedObjectSequence<IMessage>; // Property
  public messageTitle!: SharedString;

  public static Factory = new DataObjectFactory(
    "main",
    MessageList,
    [SharedObjectSequence.getFactory(), SharedString.getFactory()],
    {}
  );

  protected async initializingFirstTime() {
    const messages = SharedObjectSequence.create<any>(this.runtime);
    this.root.set("messageSequence", messages.handle);

    const messageString = SharedString.create(this.runtime);
    this.root.set("messageString", messageString.handle);
  }

  protected async hasInitialized() {
    this.messages = (await this.root
      .get<IFluidHandle>("messageSequence")
      .get()) as SharedObjectSequence<IMessage>;

    this.messages.on("op", () => {
      this.emit("messageSequence");
    });

    this.messageTitle = (await this.root
      .get<IFluidHandle>("messageString")
      .get()) as SharedString;
    this.messageTitle.on("op", () => {
      this.emit("messageString");
    });
  }

  // Public wrapper around Internal Method
  public emitEvent = (event: string) => {
    this.emit(event);
  };
}

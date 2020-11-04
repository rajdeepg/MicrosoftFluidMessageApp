import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { MessageList } from "./dataObjects/messageListDataObject";

export const ContainerFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
  MessageList.Factory.type,
  new Map([MessageList.Factory.registryEntry])
);

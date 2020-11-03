import * as React from "react";
import { MessageList } from "../dataObjects/messageListDataObject";

export const FluidContext = React.createContext<MessageList>({} as MessageList);

import { IMergeTreeDeltaOp, createRemoveRangeOp, createInsertSegmentOp, createGroupOp } from "@fluidframework/merge-tree";
import { SubSequence } from "@fluidframework/sequence";
import { diffStringsRaw } from "jest-diff";
import React from "react";
import { MessageList } from "../dataObjects/messageListDataObject";
import { FluidContext } from "./contextProvider";
import { useSelector } from "./hooks";

export interface IMessage {
    id: string;
    title: string;
    completed: boolean;
}

// Needs to inherit the context
export const getMessageSetters = () => {
    const dataObject = React.useContext(FluidContext) as MessageList;
    const { messages, messageTitle } = dataObject;

    return {
        addMessage: (title: string) => {
            // Create new Object? Pass in Handle?
            const message = {
                id: Date.now().toString(),
                title,
                completed: false,
            }
            // Put at end
            messages.insert(messages.getItemCount(), [message]);
        },
        updateMessage: (id: string, message: Partial<IMessage>) => {
            const items = messages.getItems(0);
            const index = items.findIndex((item) => item.id === id);
            let item = items[index];

            // Update existing Message with new Message info
            for (const [key, value] of Object.entries(message)) {
                item[key] = value;
            }

            const segment = new SubSequence([item])

            const ops: IMergeTreeDeltaOp[] = [];
            ops.push(createRemoveRangeOp(index, index + 1));
            ops.push(createInsertSegmentOp(index, segment));
            const groupOp = createGroupOp(...ops);

            messages.groupOperation(groupOp);
        },
        deleteMessage: (id: string) => {
            const index = messages.getItems(0).findIndex((item) => item.id === id)
            messages.remove(index, index + 1);
        },
        updateMessageText: (text: string) => {
            const diffs = diffStringsRaw(messageTitle.getText(), text, true)
            let pos = 0;
            diffs.forEach((diff, i) => {
                switch (diff[0]) {
                    case 0:
                        pos += diff[1].length;
                        break;
                    case 1:
                        messageTitle.insertText(pos, diff[1])
                        pos += diff[1].length;
                        break;
                    case -1:
                        messageTitle.removeText(pos, pos + diff[1].length)
                        break;
                }
            })
            return;
        }
    }
}

// the selectorFn is responsible for getting an IMessage[] from the MessageList
// Use UseSelector is responsible for keeping that IMessage[] up to date 
// (and react then rerendering any dependent components)
export const getMessages = () => {
    return useSelector<IMessage[]>((messageList: MessageList) => {
        return messageList.messages.getItems(0);
    }, ["messageSequence"]);
}

export const getMessageString = () => {
    return useSelector<string>((messageList: MessageList) => {
        return messageList.messageTitle.getText();
    }, ['messageString']);
}
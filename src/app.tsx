/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as  React from "react";
import * as ReactDOM from "react-dom";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { ContainerFactory } from "./container";
import { MessageList } from "./dataObjects/messageListDataObject";
import { FluidContext } from "./state/contextProvider";
import { initializeIcons, Stack } from "@fluentui/react";
import { MainPage } from "./components/MainPage";
import { getFRSContainer, hasFRSEndpoints } from "./utils/getFRSContainer";
import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";

let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = Date.now().toString();
}
const documentId = location.hash.substring(1);
document.title = documentId;

async function start(): Promise<void> {

    const container = hasFRSEndpoints() ? 
                        await getFRSContainer(documentId, ContainerFactory, createNew)
                        : await getTinyliciousContainer(documentId, ContainerFactory, createNew);

    const MessageList = await getDefaultObjectFromContainer<MessageList>(container);

    const div = document.getElementById("content") as HTMLDivElement;
    initializeIcons();

    ReactDOM.render(
        <FluidContext.Provider value={MessageList} >
            <Stack gap={24}>
                <MainPage />
            </Stack>
        </FluidContext.Provider >
        , div)


    // Reload the page on any further hash changes, e.g. in case you want to paste in a different document ID.
    window.addEventListener("hashchange", () => {
        location.reload();
    });
}

start().catch((error) => console.error(error));

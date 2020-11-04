import React from "react";
import { MessageList } from "../dataObjects/messageListDataObject";
import { FluidContext } from "./contextProvider";

/**
 * Used to keep get a value and keep it up to date.
 * React objects using this hook will get rerendered on change to the returned data
 *
 * @param selectorFunction - function that scopes the returned data
 * @param eventNames - event names to rerender on
 */
export const useSelector = <T,>(
  selectorFunction: (dataObject: MessageList) => T,
  eventNames: string[]
): T => {
  const dataObject = React.useContext(FluidContext);

  const [selectorState, setSelectorState] = React.useState<T>(
    selectorFunction(dataObject)
  );
  const updateSelectorState = () => {
    setSelectorState(selectorFunction(dataObject));
  };

  React.useEffect(() => {
    // I suspect this could be simplified?
    eventNames.forEach((name) => {
      dataObject.on(name, updateSelectorState);
    });

    () => {
      eventNames.forEach((name) => {
        dataObject.off(name, updateSelectorState);
      });
    };
  }, [dataObject]);

  return selectorState;
};

/**
 * Get's the subdirectory and returns the object of type T (the collection of children)
 * You're not guaranteed to actually get T if your data model is wrong
 * @param item a subdirectory
 */
export const getDataFromSubdirectory = <T,>(item: any): T => {
  const data = {};
  for (const [key, value] of item[1]) {
    data[key] = value;
  }
  // Watch out for this... feels like it could bite you
  data["id"] = item[0];
  return data as T;
};

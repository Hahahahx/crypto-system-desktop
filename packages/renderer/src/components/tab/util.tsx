import React from "react";
import { page, PageName } from "..";

export const getComponent = (pageIndex: PageName, params: any) => {
  const Component = page[pageIndex];
  return <Component {...params} />;
};

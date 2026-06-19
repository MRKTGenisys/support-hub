import type { ServerFunctionClient } from "payload";
import "@payloadcms/next/css";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import { importMap } from "./importMap";

type LayoutProps = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function PayloadLayout({ children }: LayoutProps) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}

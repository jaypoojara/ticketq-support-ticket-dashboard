"use client";

import { MemberstackProvider } from "@memberstack/react";

export function MemberstackWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemberstackProvider
      config={{
        publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY!,
      }}
    >
      {children}
    </MemberstackProvider>
  );
}

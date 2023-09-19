"use client";
import {SessionProvider} from "next-auth/react";
import ThemeRegistry from "@/components/themeregistry/themeregistry";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "@/components/navigation";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <>
      <SessionProvider>
        <ThemeRegistry>
          <CssBaseline />
          <Navigation />
          {children}
        </ThemeRegistry>
      </SessionProvider>
    </>
  );
}
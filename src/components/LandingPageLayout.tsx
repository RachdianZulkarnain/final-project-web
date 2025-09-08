"use client";

import React, { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => {
  return (
    <>
      <main className="">{children}</main>
    </>
  );
};

export default LandingPageLayout;

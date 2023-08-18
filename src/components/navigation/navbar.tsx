"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavItem from "./navitem";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Browse", href: "/browse" },
  { text: "Validation", href: "/validation" },
  { text: "Reporting", href: "/reporting" },
];

function NavBar() {
  const [navActive, setNavActive] = useState(Boolean);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <header>
      <nav className={`nav`}>
        <Link href={"/"}>
          <h1 className="logo">CodeWithMarish</h1>
        </Link>
        <div
          onClick={() => setNavActive(!navActive)}
          className={`nav__menu-bar`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${navActive ? "active" : ""} nav__menu-list`}>
          {MENU_LIST.map((menu, idx) => (
            <div
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
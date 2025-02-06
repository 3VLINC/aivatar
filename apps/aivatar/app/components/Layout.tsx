import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import type { PropsWithChildren } from 'react';

export default function ({ children }: PropsWithChildren) {
  return (
    <div className=" w-full h-full">
      <div className="bg-primary h-full flex-grow flex flex-col">
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-inherit">AIVATAR</p>
          </NavbarBrand>
          <NavbarContent
            className="hidden sm:flex gap-4"
            justify="center"
          ></NavbarContent>
          <NavbarContent justify="end"></NavbarContent>
        </Navbar>
        <main className="hero-content flex-grow overflow-auto">{children}</main>
        <footer className="hero-footer h-16 p-8">
          <p className="font-sans uppercase text-sm text-center text-gray-500">
            &copy; 2025 AIVATAR. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

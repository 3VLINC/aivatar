import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import type { PropsWithChildren } from 'react';
import { useLogout } from '~/providers/Auth/Auth';

export default function ({ children }: PropsWithChildren) {
  const logout = useLogout();

  return (
    <div>
      <div className="bg-primary h-full flex-grow flex flex-col">
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-inherit">AIVATAR</p>
          </NavbarBrand>
          <NavbarContent
            className="hidden sm:flex gap-4"
            justify="center"
          ></NavbarContent>
          <NavbarContent justify="end">
            {logout ? (
              <NavbarItem>
                <Link onPress={logout}>Logout</Link>
              </NavbarItem>
            ) : null}
          </NavbarContent>
        </Navbar>
        <main className="hero-content text-red flex-grow flex-shrink-0 overflow-auto">
          {children}
        </main>
        <footer className="hero-footer h-16 p-8">
          <p className="font-sans uppercase text-sm text-center text-gray-500">
            &copy; 2025 AIVATAR.
          </p>
        </footer>
      </div>
    </div>
  );
}

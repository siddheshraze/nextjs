import Link from 'next/link';

export interface NavItemProps {
  text: string,
  href: string,
  active: any
}

const NavItem = ({ text, href, active } : NavItemProps) => {
  return (
    <Link href={href} className={`nav__link`}>{text}</Link>
  );
};

export default NavItem;
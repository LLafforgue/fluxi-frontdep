import Link from "next/link";
import Image from "next/image";
import { faHouse, faIdBadge } from "@fortawesome/free-regular-svg-icons";
import {
  faGear,
  faArrowRightFromBracket,
  faBoxOpen,
  faIndustry,
  faBoxesStacked,
  faPeopleCarryBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function Sidebar({ closeSidebar }) {
  const router = useRouter();
  const path = router.pathname;

  const handleClick = () => {
    if (closeSidebar) closeSidebar();
  };


  const getLinkClasses = (href) => {
    const isActive = path === href;
    const baseClasses =
      "flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium no-underline";

    if (href === "/settings") {
      return isActive
        ? `${baseClasses} text-gray-800 bg-gray-50 border-l-4 border-gray-400 rounded-l-none`
        : `${baseClasses} text-gray-600 hover:text-gray-800 hover:bg-gray-50`;
    }

    if (href === "/") {
      return `${baseClasses} text-gray-600 hover:text-red-600 hover:bg-red-50`;
    }

    return isActive
      ? `${baseClasses} text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 rounded-l-none`
      : `${baseClasses} text-gray-800 hover:text-emerald-600 hover:bg-emerald-50`;
  };

  return (
    <aside className="p-8 w-64 h-screen top-0 left-0 z-10 box-border bg-white border-r border-gray-200 shadow-sm">
      <Image src="/image/logo.svg" alt="logo-Fluxi" width={500} height={500} />
      <div className="border-t border-gray-100 h-full py-6 flex flex-col justify-between">
        <nav>
          <ul className="p-0 m-0 list-none flex flex-col space-y-1">
            <li>
              <Link
                onClick={handleClick}
                href="/dashboard"
                className={getLinkClasses("/dashboard")}
              >
                <FontAwesomeIcon icon={faHouse} className="mr-3 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/stock"
                className={getLinkClasses("/stock")}
              >
                <FontAwesomeIcon icon={faBoxesStacked} className="mr-3 w-5" />
                Stock
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/orders"
                className={getLinkClasses("/orders")}
              >
                <FontAwesomeIcon icon={faBoxOpen} className="mr-3 w-5" />
                Commandes
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/production"
                className={getLinkClasses("/production")}
              >
                <FontAwesomeIcon icon={faIndustry} className="mr-3 w-5" />
                Productions
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/customers"
                className={getLinkClasses("/customers")}
              >
                <FontAwesomeIcon icon={faIdBadge} className="mr-3 w-5" />
                Clients
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/suppliers"
                className={getLinkClasses("/suppliers")}
              >
                <FontAwesomeIcon icon={faPeopleCarryBox} className="mr-3 w-5" />
                Fournisseurs
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="mb-20">
          <ul className="p-0 m-0 list-none flex flex-col space-y-1">
            <li>
              <Link
                onClick={handleClick}
                href="/settings"
                className={getLinkClasses("/settings")}
              >
                <FontAwesomeIcon icon={faGear} className="mr-3 w-5" />
                Paramètres
              </Link>
            </li>
            <li>
              <Link
                onClick={handleClick}
                href="/logout"
                className={getLinkClasses("/")}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="mr-3 w-5"
                />
                Déconnection
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

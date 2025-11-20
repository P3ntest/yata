import { MdContentPaste, MdHome, MdPeople } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";

const dockItems = [
  {
    name: "Home",
    icon: MdHome,
    path: "/home",
  },
  {
    name: "Shared",
    icon: MdPeople,
    path: "/shared",
  },
  {
    name: "Templates",
    icon: MdContentPaste,
    path: "/templates",
  },
];

export function DockLayout() {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="dock bg-base-300"
        style={{
          marginBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {dockItems.map((item, index) => {
          return (
            <button
              key={index}
              className={twMerge(
                item.path.toLowerCase().startsWith(currentPath.toLowerCase()) &&
                  "dock-active"
              )}
              title={item.name}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={"1.2em"} />
              <span className="dock-label">{item.name}</span>
            </button>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}

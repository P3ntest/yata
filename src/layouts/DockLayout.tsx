import { MdContentPaste, MdHome, MdPeople } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import useDetectKeyboardOpen from "use-detect-keyboard-open";
import { motion } from "motion/react";

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
  const keyboardOpen = useDetectKeyboardOpen();

  return (
    <div>
      <motion.div
        animate={{
          scaleY: keyboardOpen ? 0 : 1,
        }}
        className="dock dock-lg bg-base-300"
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
      </motion.div>
      <Outlet />
    </div>
  );
}

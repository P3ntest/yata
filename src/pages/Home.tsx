import { GiTacos } from "react-icons/gi";
import { MdArrowForward, MdArrowRight, MdSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { usePbAuthStore, usePbList, usePbLive } from "use-pocketbase";
import { decToHex } from "../util/color";

const lists = [
  {
    name: "Nachos",
    icon: "🌮",
    color: "#FBBF24",
  },
  {
    name: "Groceries",
    icon: "🛒",
    color: "#34D399",
  },
  {
    name: "Movies to watch",
    icon: "🎬",
    color: "#60A5FA",
  },
  {
    name: "Books to read",
    icon: "📚",
    color: "#A78BFA",
  },
  {
    name: "Books to read",
    icon: "📚",
    color: "#A78BFA",
  },
  {
    name: "Books to read",
    icon: "📚",
    color: "#A78BFA",
  },
];

export function HomePage() {
  const { record: user, clear } = usePbAuthStore();

  const { data: myLists } = usePbList("lists");
  usePbLive("lists");

  return (
    <div className="p-4 py-6">
      <div className="flex flex-row items-center justify-between my-4">
        <h1 className="text-2xl font-bold">Hello, {user?.username}!</h1>
        <button className="btn btn-circle" onClick={() => clear()}>
          <MdSettings size={"1.7em"} />
        </button>
      </div>

      <div className="divider"></div>

      <HorList title="Pinned Lists">
        {lists.map((list, index) => (
          <ListCard key={index} {...list} />
        ))}
      </HorList>

      <HorList title="My Lists" href="/lists">
        {myLists?.items.map((list, index) => (
          <ListCard
            key={index}
            color={decToHex(list.color)}
            name={list.name}
            icon={list.icon}
            id={list.id}
          />
        ))}
      </HorList>
    </div>
  );
}

function ListCard({
  name,
  icon,
  color,
  id,
}: {
  name: string;
  icon: React.ReactNode;
  color: string;
  id?: string;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer inline-block rounded-2xl border-2 p-2 w-36 flex-none"
      style={{
        borderColor: color,
        backgroundColor: `${color}40`,
      }}
      onClick={() => {
        if (id) {
          navigate(`/lists/${id}`);
        }
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-3xl">{icon}</span>
        <h3 className="px-1 font-bold line-clamp-1 text-sm text-center">
          {name}
        </h3>
      </div>
    </div>
  );
}

function HorList({
  children,
  title,
  href,
}: {
  children: React.ReactNode;
  title: string;
  href?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="my-4 mb-6">
      <div className="flex flex-row items-center justify-between">
        <div
          className={twMerge(
            "mb-2 flex flex-row items-center gap-2",
            href && "cursor-pointer"
          )}
          onClick={() => {
            if (href) {
              navigate(href);
            }
          }}
        >
          <h2 className="text-lg font-bold ">{title}</h2>
          {href && <MdArrowForward />}
        </div>
        {href && <button className="btn btn-link">See all</button>}
      </div>
      <div className="flex overflow-x-auto gap-4">{children}</div>
    </div>
  );
}

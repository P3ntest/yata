import { useRef, useState, type RefObject } from "react";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import {
  usePbFullList,
  usePbLive,
  usePbMutations,
  usePbOne,
} from "use-pocketbase";
import { motion } from "motion/react";
import { div } from "motion/react-client";
import { useOnClickOutside } from "usehooks-ts";
import { MdArrowBack } from "react-icons/md";

export function ListView() {
  const { listId } = useParams<{ listId: string }>();
  const { data: items, refetch } = usePbFullList("items", {
    query: {
      listId: listId || "",
    },
  });

  const navigate = useNavigate();

  const {
    update: { mutateAsync: updateItem },
    deleteRecord: { mutateAsync: deleteItem },
  } = usePbMutations("items");

  usePbLive("items");

  const { data: list } = usePbOne("lists", listId || "");

  return (
    <div className="">
      <div className="bg-base-200 border-b-2 border-base-300 border-dashed px-6 py-4 flex flex-row items-center gap-4">
        <button
          className="btn btn-circle btn-neutral btn-sm"
          onClick={() => {
            navigate(-1);
          }}
        >
          <MdArrowBack size={"1.5em"} />
        </button>
        <h1 className="font-bold text-lg">{list?.name}</h1>
      </div>
      <div className="p-4">
        {items
          ?.sort((a) => a.completed)
          .map((item) => (
            <motion.div
              drag="x"
              //   dragConstraints={{ left: 100, right: 100 }}
              //   dragElastic={0.2}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                  deleteItem(item.id).then(() => refetch());
                }
              }}
              whileDrag={{
                opacity: 0.3,
              }}
              layoutId={item.id}
              animate={{ scale: 1 }}
              initial={{ scale: 0.0 }}
              exit={{ scale: 0.0 }}
              layout
              key={item.id}
              className="p-2 flex flex-row items-center gap-4 cursor-pointer"
              onClick={() => {
                updateItem({
                  id: item.id,
                  completed: !item.completed,
                }).then(() => refetch());
              }}
            >
              <input
                type="checkbox"
                className={twMerge(
                  "checkbox",
                  item.completed ? "checkbox-neutral" : "checkbox-primary"
                )}
                checked={item.completed}
                readOnly
              />
              <span
                className={twMerge(
                  item.completed && "line-through text-neutral-content"
                )}
              >
                {item.name}
              </span>
            </motion.div>
          ))}
      </div>
      {listId && <CreateDock listId={listId} />}
    </div>
  );
}

function CreateDock({ listId }: { listId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    create: { mutateAsync: createItem },
  } = usePbMutations("items");

  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  useOnClickOutside(ref as RefObject<HTMLDivElement>, () => setOpen(false));

  return (
    <div
      ref={ref}
      className="fixed w-full"
      style={{
        bottom: "calc(4rem + env(safe-area-inset-bottom))",
      }}
    >
      <motion.div
        layout
        className="bg-base-200 w-full rounded-t-3xl py-5 px-6"
        transition={{}}
      >
        <form
          className="join w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            await createItem({
              name: name.trim(),
              list: listId,
            });
            setName("");
          }}
        >
          <input
            ref={inputRef}
            onFocus={() => {
              setOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!inputRef.current?.matches(":focus")) setOpen(false);
              });
            }}
            type="text"
            className="input join-item"
            placeholder="New item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className={twMerge(
              "btn btn-primary join-item",
              (!name || name.trim().length == 0) && "btn-disabled"
            )}
            type="submit"
          >
            Add
          </button>
        </form>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10"
          >
            Hello world
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

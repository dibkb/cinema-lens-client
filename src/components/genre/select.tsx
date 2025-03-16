import { useCallback, useState } from "react";
import Magnifier from "../../icons/maginifer";
import Xcircle from "@/icons/x-circle";
import { genres } from "@/data/genre";
import { cn } from "@/lib/utils";
const SelectGenre = () => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const onSelectHandler = useCallback((id: number) => {
    setSelected((prev) => [...prev, id]);
  }, []);
  const onRemoveHandler = useCallback((id: number) => {
    setSelected((prev) => prev.filter((item) => item !== id));
  }, []);
  const onClickHandler = useCallback(
    (id: number) => {
      if (selected.includes(id)) {
        onRemoveHandler(id);
      } else {
        onSelectHandler(id);
      }
    },
    [onRemoveHandler, onSelectHandler, selected]
  );
  return (
    <div className="flex items-center gap-2 border border-stone-300 rounded-xl px-2 py-1 text-sm w-fit hover:border-blue-500 focus-within:border-blue-500 relative focus-within:bg-white">
      <Magnifier />
      <input
        type="text"
        placeholder="Select genre"
        className="outline-none font-medium"
        value={input}
        onChange={({ target }) => setInput(target.value)}
      />
      <div className="absolute right-2">
        {input && (
          <Xcircle
            className="text-stone-400 hover:text-stone-600 cursor-pointer"
            onClick={() => setInput("")}
          />
        )}
      </div>
      <main className="absolute top-9 right-0 border bg-white border-stone-300 rounded-xl w-full py-1 overflow-y-auto max-h-[300px]">
        {genres.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-2 hover:bg-stone-100 cursor-pointer px-2 py-[1px] rounded-md mx-1 my-[1px] justify-between",
              selected.includes(item.id) && " text-blue-600"
            )}
            onClick={() => {
              onClickHandler(item.id);
            }}
          >
            <p>{item.name}</p>
            {selected.includes(item.id) && (
              <span
                className=" w-2 h-2 bg-blue-500 rounded-full"
                onClick={() => onRemoveHandler(item.id)}
              ></span>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default SelectGenre;

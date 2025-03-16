import { useState } from "react";
import Magnifier from "../../icons/maginifer";
import Xcircle from "@/icons/x-circle";

const SelectGenre = () => {
  const [input, setInput] = useState("");
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
    </div>
  );
};

export default SelectGenre;

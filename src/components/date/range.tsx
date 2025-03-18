import { useCallback, useState, useMemo } from "react";
import Magnifier from "../../icons/maginifer";
import Xcircle from "@/icons/x-circle";

import { cn } from "@/lib/utils";
import { AccentColor, getAccentColors } from "@/lib/colors";
import "@/styles/scrollbar.css";
import { useQueryState, parseAsInteger, parseAsArrayOf } from "nuqs";
import { years } from "@/data/year";
import useHistoryStore from "@/store/history";

interface SelectGenreProps {
  accentColor?: AccentColor;
}

const DateRange = ({ accentColor = "cyan" }: SelectGenreProps) => {
  const { homepage } = useHistoryStore();
  const [input, setInput] = useQueryState("date", { defaultValue: "" });
  const [selected, setSelected] = useQueryState(
    "year",
    parseAsArrayOf(parseAsInteger)
  );
  const [isFocused, setIsFocused] = useState(false);

  const colors = useMemo(() => getAccentColors(accentColor), [accentColor]);

  const filteredGenres = useMemo(() => {
    if (!input.trim()) return years;
    const searchTerm = input.toLowerCase();
    return years.filter((year) =>
      year.toString().toLowerCase().includes(searchTerm)
    );
  }, [input]);

  const onSelectHandler = useCallback(
    (id: number) => {
      setSelected((prev) => {
        if (!prev) return [id];
        return [...prev, id];
      });
    },
    [setSelected]
  );
  const onRemoveHandler = useCallback(
    (id: number) => {
      setSelected((prev) => {
        if (!prev) return null;
        return prev.filter((item) => item !== id);
      });
    },
    [setSelected]
  );
  const onClickHandler = useCallback(
    (id: number, event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent the click from causing blur
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (selected?.includes(id)) {
        onRemoveHandler(id);
      } else {
        onSelectHandler(id);
      }
    },
    [onRemoveHandler, onSelectHandler, selected]
  );
  const previewItem = years.filter((item) => selected?.includes(item));
  const preview = previewItem.length > 0 && (
    <div className="flex items-center gap-1.5">
      <p
        className={cn(
          "px-2 py-0.5 rounded-md text-xs font-medium",
          colors.dark,
          colors.light
        )}
      >
        {previewItem[0]}
        {previewItem.length > 1 && (
          <span className="ml-1">{`+${previewItem.length - 1}`}</span>
        )}
      </p>
    </div>
  );
  const containerClass = useMemo(() => {
    return cn(
      "flex items-center gap-2 border border-stone-300 rounded-xl px-2.5 py-1.5",
      "text-sm w-full min-w-[200px] md:min-w-[300px] max-w-[360px]",
      "transition-colors duration-150",
      `focus-within:bg-white relative`,
      "h-9",
      `hover:border-${accentColor}-500 focus-within:border-${accentColor}-500`,
      selected && selected?.length > 0 && "bg-white"
    );
  }, [accentColor, selected]);
  return (
    <div
      className={containerClass}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only blur if we're not clicking inside the component
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <Magnifier className="flex-shrink-0 text-gray-500" />

      <div className="flex-1 relative">
        {selected && selected?.length > 0 && !isFocused ? (
          <div className="flex items-center">{preview}</div>
        ) : (
          <input
            type="text"
            placeholder="Select year"
            className="w-full outline-none font-medium placeholder:text-gray-500"
            value={input}
            onChange={({ target }) => setInput(target.value)}
          />
        )}
      </div>

      {input && (
        <Xcircle
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          onClick={() => setInput("")}
        />
      )}

      {isFocused && filteredGenres.length > 0 && (
        <main
          className={cn(
            "absolute mt-1 left-0 right-0 border bg-white border-stone-300 rounded-xl py-1 overflow-y-auto max-h-[300px] scrollbar-hide shadow-lg",
            homepage === true ? "top-full" : " bottom-[calc(100%+10px)]"
          )}
        >
          {filteredGenres.map((item) => (
            <div
              key={item}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5",
                "cursor-pointer transition-colors",
                colors.hover,
                "rounded-md mx-1 my-[1px] justify-between",
                selected?.includes(item) &&
                  cn(colors.dark, "bg-opacity-50", colors.light)
              )}
              onClick={(e) => onClickHandler(item, e)}
            >
              <p className="truncate">{item}</p>
              {selected?.includes(item) && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    colors.medium
                  )}
                  onClick={() => onRemoveHandler(item)}
                />
              )}
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

export default DateRange;

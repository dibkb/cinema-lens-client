import { useCallback, useState, useMemo } from "react";
import Magnifier from "../../icons/maginifer";
import Xcircle from "@/icons/x-circle";
import { genres } from "@/data/genre";
import { cn } from "@/lib/utils";
import { AccentColor, getAccentColors } from "@/lib/colors";
import "@/styles/scrollbar.css";
import { useQueryState } from "nuqs";

interface SelectGenreProps {
  accentColor?: AccentColor;
}

const SelectGenre = ({ accentColor = "cyan" }: SelectGenreProps) => {
  const [input, setInput] = useQueryState("genre", { defaultValue: "" });
  const [selected, setSelected] = useState<number[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const colors = getAccentColors(accentColor);

  const filteredGenres = useMemo(() => {
    if (!input.trim()) return genres;
    const searchTerm = input.toLowerCase();
    return genres.filter((genre) =>
      genre.name.toLowerCase().includes(searchTerm)
    );
  }, [input]);

  const onSelectHandler = useCallback((id: number) => {
    setSelected((prev) => [...prev, id]);
  }, []);
  const onRemoveHandler = useCallback((id: number) => {
    setSelected((prev) => prev.filter((item) => item !== id));
  }, []);
  const onClickHandler = useCallback(
    (id: number, event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent the click from causing blur
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (selected.includes(id)) {
        onRemoveHandler(id);
      } else {
        onSelectHandler(id);
      }
    },
    [onRemoveHandler, onSelectHandler, selected]
  );
  const previewItem = genres.filter((item) => selected.includes(item.id));
  const preview = previewItem.length > 0 && (
    <div className="flex items-center gap-1.5">
      <p
        className={cn(
          "px-2 py-0.5 rounded-md text-xs font-medium",
          colors.dark,
          colors.light
        )}
      >
        {previewItem[0].name}
        {previewItem.length > 1 && (
          <span className="ml-1">{`+${previewItem.length - 1}`}</span>
        )}
      </p>
    </div>
  );
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-stone-300 rounded-xl px-2.5 py-1.5",
        "text-sm min-w-[240px] max-w-[320px]",
        "transition-colors duration-150",
        `hover:border-${accentColor}-500 focus-within:border-${accentColor}-500 focus-within:bg-white relative`,
        "h-9",
        selected.length > 0 && "bg-white"
      )}
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
        {selected.length > 0 && !isFocused ? (
          <div className="flex items-center">{preview}</div>
        ) : (
          <input
            type="text"
            placeholder="Select genre"
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
        <main className="absolute top-full mt-1 left-0 right-0 border bg-white border-stone-300 rounded-xl py-1 overflow-y-auto max-h-[300px] scrollbar-hide shadow-lg">
          {filteredGenres.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5",
                "cursor-pointer transition-colors",
                colors.hover,
                "rounded-md mx-1 my-[1px] justify-between",
                selected.includes(item.id) &&
                  cn(colors.dark, "bg-opacity-50", colors.light)
              )}
              onClick={(e) => onClickHandler(item.id, e)}
            >
              <p className="truncate">{item.name}</p>
              {selected.includes(item.id) && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    colors.medium
                  )}
                  onClick={() => onRemoveHandler(item.id)}
                />
              )}
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

export default SelectGenre;

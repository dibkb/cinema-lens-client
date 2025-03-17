import Letterboxd from "@/icons/letterboxd";
import Reddit from "@/icons/reddit";
import UpArrow from "@/icons/up-arrow";
import { cn } from "@/lib/utils";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo } from "react";

const SearchBox = ({
  type,
  handleSubmit,
  query,
  setQuery,
  className,
}: {
  type?: string;
  homepage?: boolean;
  handleSubmit: () => void;
  query: string;
  setQuery: (query: string) => void;
  className?: string;
}) => {
  const [reddit, setReddit] = useQueryState(
    "reddit",
    parseAsBoolean.withDefault(false)
  );
  const [letterboxd, setLetterboxd] = useQueryState(
    "letterboxd",
    parseAsBoolean.withDefault(false)
  );

  const copy = useMemo(() => {
    if (type === "natural-language") {
      return {
        placeholder:
          "Type your movie query here… e.g., 'movies directed by Steven Spielberg in the 1980s'",
        color: "blue",
      };
    } else if (type === "plot-summaries") {
      return {
        placeholder:
          "Type your movie plot here… e.g., 'movies where there is a murder mystery and there is a mole in the police force'",
        color: "cyan",
      };
    }
  }, [type]);

  return (
    <div
      className={cn(
        "rounded-lg w-[900px] max-w-[90vw] px-4 py-2 flex flex-col bg-zinc-50 border border-zinc-200",
        className
      )}
    >
      <textarea
        placeholder={copy?.placeholder}
        className="w-full outline-none resize-none overflow-y-hidden min-h-[4rem] font-medium"
        style={{ height: "auto" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "0px";
          target.style.height = `${target.scrollHeight}px`;
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <main className="h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {type === "natural-language" && (
            <>
              <span
                onClick={() => setReddit((prev) => !prev)}
                className={cn(
                  "text-gray-500 font-medium border border-gray-200 rounded-full px-2 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors",
                  reddit && "bg-blue-50 border-blue-500 text-blue-500"
                )}
              >
                <Reddit /> Search Reddit
              </span>
              <span
                onClick={() => setLetterboxd((prev) => !prev)}
                className={cn(
                  "text-gray-500 font-medium border border-gray-200 rounded-full px-2 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors",
                  letterboxd && "bg-blue-50 border-blue-500 text-blue-500"
                )}
              >
                <Letterboxd /> Search Letterboxd
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "transition-colors cursor-pointer",
            copy?.color === "blue" && "bg-blue-600 hover:bg-blue-700",
            copy?.color === "cyan" && "bg-cyan-600 hover:bg-cyan-700"
          )}
        >
          <UpArrow className="text-white" />
        </button>
      </main>
    </div>
  );
};

export default SearchBox;

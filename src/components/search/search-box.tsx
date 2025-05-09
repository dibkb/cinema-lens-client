import Letterboxd from "@/icons/letterboxd";
import Reddit from "@/icons/reddit";
import UpArrow from "@/icons/up-arrow";
import { cn } from "@/lib/utils";
// import { WandSparkles } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo } from "react";

const SearchBox = ({
  type,
  handleSubmitSearch,
  handleSubmitSemantic,
  query,
  setQuery,
  className,
  isStreaming,
}: {
  type?: string;
  homepage?: boolean;
  handleSubmitSearch: () => void;
  handleSubmitSemantic: () => void;
  query: string;
  setQuery: (query: string) => void;
  className?: string;
  isStreaming: boolean;
}) => {
  const [reddit, setReddit] = useQueryState(
    "reddit",
    parseAsBoolean.withDefault(false)
  );
  const [letterboxd, setLetterboxd] = useQueryState(
    "letterboxd",
    parseAsBoolean.withDefault(false)
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStreaming) {
      return;
    }
    if (type === "natural-language") {
      handleSubmitSearch();
    } else {
      handleSubmitSemantic();
    }
  };

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
          "Type your movie plot here… e.g., 'A scientist perfects time travel but accidentally strands himself in a dystopian future where history has been rewritten. Hunted by a ruthless regime that wants his technology...'",
        color: "cyan",
      };
    }
  }, [type]);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit(e);
        }
      }}
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
        <div className="flex items-center gap-2">
          {/* {type === "plot-summaries" && !isStreaming && query && (
            <button
              onClick={isStreaming ? undefined : handleSubmit}
              className={cn(
                "rounded-full flex items-center justify-center gap-2 py-1 text-zinc-500 font-medium border",
                "transition-colors cursor-pointer px-4 text-xs",
                "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-300"
              )}
            >
              Tidy up
              <WandSparkles className="text-zinc-500 size-4" />
            </button>
          )} */}

          <button
            type="submit"
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center",
              "transition-colors cursor-pointer",
              copy?.color === "blue" && "bg-blue-600 hover:bg-blue-700",
              copy?.color === "cyan" && "bg-cyan-600 hover:bg-cyan-700"
            )}
          >
            {isStreaming ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UpArrow className="text-white" />
            )}
          </button>
        </div>
      </main>
    </form>
  );
};

export default SearchBox;

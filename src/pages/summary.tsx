import PlotSummariesMovies from "@/components/results/plot-summaries-movies";
import { cn } from "@/lib/utils";
import useHistoryStore from "@/store/history";
const PlotSummary = ({
  searchMessagesEndRef,
  isStreaming,
}: {
  searchMessagesEndRef: React.RefObject<HTMLDivElement | null>;
  isStreaming: boolean;
}) => {
  const { tempMessages, plot_summaries } = useHistoryStore();

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-1 text-sm text-stone-500 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cutive-mono-regular font-medium",
          !isStreaming && "hidden"
        )}
      >
        {tempMessages.map((message) => (
          <div key={message}>{message}</div>
        ))}
        <div ref={searchMessagesEndRef}></div>
      </div>

      <div className="mb-4 p-4">
        {/* {isStreaming === false && <MessageRenderer />} */}
        {plot_summaries.length ? <PlotSummariesMovies /> : ""}
        <span className="h-[180px] w-full bg-white flex"></span>
      </div>
    </>
  );
};

export default PlotSummary;

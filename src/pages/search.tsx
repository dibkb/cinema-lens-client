import Letterboxd from "@/components/results/Letterboxd";
import MessageRenderer from "@/components/results/message-render";
import RedditMovies from "@/components/results/RedditMovies";
import RelatedMovies from "@/components/results/related";
import SimilarMovies from "@/components/results/similar";
import { cn } from "@/lib/utils";
import useHistoryStore from "@/store/history";
const Search = ({
  searchMessagesEndRef,
  isStreaming,
}: {
  searchMessagesEndRef: React.RefObject<HTMLDivElement | null>;
  isStreaming: boolean;
}) => {
  const {
    tempMessages,
    reddit_movies,
    letterboxd_movies,
    similar_movies,
    related_movies,
  } = useHistoryStore();
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-1 text-sm text-stone-500 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cutive-mono-regular font-medium"
          //   !isStreaming && "hidden"
        )}
      >
        {tempMessages.map((message) => (
          <div key={message}>{message}</div>
        ))}
        <div ref={searchMessagesEndRef} />
      </div>
      <div className="mb-4">
        {/* {isStreaming === false && <MessageRenderer />} */}
        {reddit_movies.length > 0 && <RedditMovies />}
        {letterboxd_movies.length > 0 && <Letterboxd />}
        {similar_movies.length > 0 && <SimilarMovies />}
        {related_movies.length > 0 && <RelatedMovies />}

        <span className="h-[180px] w-full bg-white flex"></span>
      </div>
    </>
  );
};

export default Search;

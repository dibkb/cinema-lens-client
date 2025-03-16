import DateRange from "../date/range";
import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Summary = () => {
  return (
    <TabsLayout>
      <div className="flex items-center justify-center gap-2">
        <SelectGenre accentColor="cyan" />
        <DateRange accentColor="cyan" />
      </div>
    </TabsLayout>
  );
};

export default Summary;

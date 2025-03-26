import DateRange from "../date/range";
import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Summary = () => {
  return (
    <TabsLayout>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <SelectGenre accentColor="cyan" invisible={true} />
        <DateRange accentColor="cyan" invisible={true} />
      </div>
    </TabsLayout>
  );
};

export default Summary;

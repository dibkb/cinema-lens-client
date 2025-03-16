import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Language = () => {
  return (
    <TabsLayout className="">
      <div className="flex items-center justify-center gap-2">
        <SelectGenre accentColor="blue" />
        <SelectGenre accentColor="blue" />
      </div>
    </TabsLayout>
  );
};

export default Language;

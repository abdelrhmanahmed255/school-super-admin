import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import SelectStatus from "./SelectStatus";
import SeachBar from "./SeachBar";
import AddSchool from "../addSchool/AddSchool";

function SchoolsFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-3">
        <SeachBar />
        <SelectStatus />
      </div>

      <AddSchool>
        <Button variant={"default"} className="min-w-28 justify-between">
          <Plus /> Add School
        </Button>
      </AddSchool>
    </div>
  );
}

export default SchoolsFilters;

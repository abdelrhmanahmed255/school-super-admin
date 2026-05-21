import SchoolsHeader from "../(routes)/schools/_components/SchoolHeader";
import SchoolsFilters from "../(routes)/schools/_components/filters/SchoolsFilters";
import SchoolsTable from "../(routes)/schools/_components/table/SchoolTable";

function SchoolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SchoolsHeader />
      <SchoolsFilters />
      <SchoolsTable />
    </div>
  );
}

export default SchoolsPage;

import SchoolsHeader from "./_components/SchoolHeader";
import SchoolsFilters from "./_components/filters/SchoolsFilters";
import SchoolsTable from "./_components/table/SchoolTable";

export default function SchoolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SchoolsHeader />
      <SchoolsFilters />
      <SchoolsTable />
    </div>
  );
}

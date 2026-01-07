


import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LogsList from "../../components/tables/BasicTables/LogsList";
export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />

      <PageBreadcrumb pageTitle="Logs" />
      <div className="space-y-6">
        <ComponentCard>
          <LogsList />
        </ComponentCard>
      </div>
    </>
  );
}



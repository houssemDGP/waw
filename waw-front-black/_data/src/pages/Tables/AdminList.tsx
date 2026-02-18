import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdminList from "../../components/tables/BasicTables/AdminList";
export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />

      <PageBreadcrumb pageTitle="Admin" />
      <div className="space-y-6">
        <ComponentCard>
          <AdminList />
        </ComponentCard>
      </div>
    </>
  );
}



import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserList from "../../components/tables/BasicTables/UserList";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="waw"
        description="waw"
      />
      <PageBreadcrumb pageTitle="Utilisateurs" />
      <div className="space-y-6">
        <ComponentCard>
          <UserList />
        </ComponentCard>
      </div>
    </>
  );
}



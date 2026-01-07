import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BackOfficeVendeurEvents from "../../components/tables/BasicTables/BackOfficeVendeurEvents";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Liste des activités"
        description="Liste des activités"
      />
      <PageBreadcrumb pageTitle="Liste des activités" />
      <div className="space-y-6">
        <ComponentCard>
          <BackOfficeVendeurEvents />
        </ComponentCard>
      </div>
    </>
  );
}



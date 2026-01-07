
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ActivitesList from "../../components/tables/BasicTables/ActivitesList";
export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Gestion Activites" />
      <div className="space-y-6">
        <ComponentCard>
          <ActivitesList />
        </ComponentCard>
      </div>
    </>
  );
}



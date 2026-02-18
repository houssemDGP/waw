
import PageBreadcrumb from "./components/common/PageBreadCrumb.tsx";
import ComponentCard from "./components/common/ComponentCard.tsx";
import ActivitesList from "./components/tables/BasicTables/ActivitesList.tsx";
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



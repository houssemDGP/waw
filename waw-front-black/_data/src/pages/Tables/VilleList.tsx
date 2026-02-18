

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import VilleList from "../../components/tables/BasicTables/VilleList";
export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />
      <PageBreadcrumb pageTitle="Villes" />
      <div className="space-y-6">
        <ComponentCard>
          <VilleList />
        </ComponentCard>
      </div>
    </>
  );
}





import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BusnissList from "../../components/tables/BasicTables/BusnissList";
export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />

      <PageBreadcrumb pageTitle="business" />
      <div className="space-y-6">
        <ComponentCard>
          <BusnissList />
        </ComponentCard>
      </div>
    </>
  );
}



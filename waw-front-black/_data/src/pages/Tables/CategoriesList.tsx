

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoriesList from "../../components/tables/BasicTables/CategoriesList";

export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />

      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard>
          <CategoriesList />
        </ComponentCard>
      </div>
    </>
  );
}

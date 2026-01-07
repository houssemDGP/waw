

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BannerList from "../../components/tables/BasicTables/BannerList";
export default function BasicTables() {
  return (
    <>
      <PageMeta      title="waw"        description="waw"     />

      <PageBreadcrumb pageTitle="Banners" />
      <div className="space-y-6">
        <ComponentCard>
          <BannerList />
        </ComponentCard>
      </div>
    </>
  );
}



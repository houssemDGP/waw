import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BackOfficeVendeurRestaurants from "../../components/tables/BasicTables/BackOfficeVendeurRestaurants";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Liste des Restaurants"
        description="Liste des Restaurants"
      />
      <PageBreadcrumb pageTitle="Liste des Restaurants" />
      <div className="space-y-6">
        <ComponentCard>
          <BackOfficeVendeurRestaurants />
        </ComponentCard>
      </div>
    </>
  );
}



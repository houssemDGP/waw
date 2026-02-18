import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EventsList from "../../components/tables/BasicTables/EventsList";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Liste des evenements"
        description="Liste des evenements"
      />
      <PageBreadcrumb pageTitle="Liste des evenements" />
      <div className="space-y-6">
        <ComponentCard>
          <EventsList />
        </ComponentCard>
      </div>
    </>
  );
}



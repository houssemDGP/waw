
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ArticleIndex from "../../components/tables/BasicTables/ArticleIndex";
export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Gestion ArticleIndex" />
      <div className="space-y-6">
        <ComponentCard>
          <ArticleIndex />
        </ComponentCard>
      </div>
    </>
  );
}



import SoilLocation from '../../components/map/mymap';
import PageMeta from '../../components/common/PageMeta';
import SoilList from '../../components/soil/SoilList';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

export default function Soil() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Soil Classification"
        description="SoilSnap Soil Classification Page."
        
      />
      <PageBreadcrumb pageTitle="Soil Classification" />
      <SoilList />
    </>
  );
}

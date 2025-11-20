import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Details from '../../components/crops/CropsDetails';
import { Link } from 'react-router';

export default function CropDetails() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Crops Details"
        description="SoilSnap Crop Details Page."
      />
      <Link to={'/crops'} className='mb-2'>Back</Link>
      <Details />
    </>
  );
}

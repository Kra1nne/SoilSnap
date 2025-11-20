import SoilLocation from '../../components/map/mymap';
import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';
import CropsList from '../../components/crops/CropsList'; 
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

export default function Crop() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Crops"
        description="SoilSnap Crop Recommendation Page."
      />
      <PageBreadcrumb pageTitle="Crops" />
      <CropsList />
    </>
  );
}

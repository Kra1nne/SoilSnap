import React from 'react';
import Map from '../../components/map/mymap.jsx';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

export default function MapView() {
 
  return (
    <div className="App">
      <PageMeta
        title="SoilSnap | Map"
        description="SoilSnap map management page"
      />
      <PageBreadcrumb pageTitle="Map" />
      <Map />
      
    </div>
  );
}
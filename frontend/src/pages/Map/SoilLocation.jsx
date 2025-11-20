import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Location from '../../components/map/location-list';

export default function SoilLocation() {
  return (
    <div className="App">
      <PageMeta
        title="SoilSnap | Soil Location"
        description="SoilSnap soil location management page"
      />
      <PageBreadcrumb pageTitle="Soil Location" />
      <div>
        <Location />
      </div>
    </div>
  );
}
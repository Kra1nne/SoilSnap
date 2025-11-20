import PageMeta from "../../components/common/PageMeta"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import UserRequest from "../../components/request/UserRequest"

export default function Request() {
    return (
        <>
            <PageMeta
                title="SoilSnap | Request"
                description="SoilSnap Request Page."
            />
            <PageBreadcrumb pageTitle="Request" />
            <UserRequest />
        </>
    )
}
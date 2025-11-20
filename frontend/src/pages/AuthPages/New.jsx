import NewPassword from "../../components/auth/NewPassword";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function New() {
    return (
        <>
            <PageMeta
                title="SoilSnap | New Password"
                description="Create a new password for your SoilSnap account."
            />
            <AuthLayout>
                <NewPassword />
            </AuthLayout>
        </>
    )
}

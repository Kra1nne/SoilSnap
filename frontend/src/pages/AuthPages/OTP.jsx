import OTPForm from "../../components/auth/OTPForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function Reset() {
    return (
        <>
            <PageMeta
                title="SoilSnap | Reset Password"
                description="Reset your SoilSnap account password."
            />
            <AuthLayout>
                <OTPForm />
            </AuthLayout>
        </>
    )
}

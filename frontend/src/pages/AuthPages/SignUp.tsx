import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Sign Up"
        description="SoilSnap is a platform for soil data management and analysis."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}

import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Sign In"
        description="SoilSnap is a platform for soil data management and analysis."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

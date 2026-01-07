import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="WAW - Creer un compte"
        description="WAW - Creer un compte"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

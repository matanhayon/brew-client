import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn path="/signin" routing="path" />
    </div>
  );
};

export default SignInPage;

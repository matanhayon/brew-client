import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
};

export default SignInPage;

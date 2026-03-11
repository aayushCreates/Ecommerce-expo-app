import { SignIn } from "@clerk/react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'btn btn-primary',
            card: 'shadow-2xl border border-base-content/5',
          }
        }}
      />
    </div>
  );
};

export default Login;

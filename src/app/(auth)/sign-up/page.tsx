import { SignUpForm } from "@/components/sign-up-form"

const SignUpPage = () => {
    return (
        <>
            <div className="space-y-1.5">
                <h1 className="text-3xl font-bold">Lights. Camera. Sign up!</h1>
                <p className="text-zinc-400">Set up your seat on the couch.</p>
            </div>
            <SignUpForm />
        </>
    )
}

export default SignUpPage
import { Suspense } from "react";
import { LoginForm } from "../components/LoginForm";
function LoadingFallback() {
    return <div>Загрузка формы...</div>;
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}
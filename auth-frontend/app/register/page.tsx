import { Suspense } from "react";
import { RegistrationForm } from "../components/RegistrationFomr";
function LoadingFallback() {
    return <div>Загрузка формы...</div>;
}

export default function RegistrationPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
         <RegistrationForm/>
        </Suspense>
    );
}
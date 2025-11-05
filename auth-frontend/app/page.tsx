import { ChangeNameForm } from "./components/ChangeNameForm";
import { LogoutButton } from "./components/LogoutButton";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Добро пожаловать!
          </h2>
          <div className="space-y-6">
            <ChangeNameForm />
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
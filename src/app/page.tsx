import { redirectIfAuthenticated } from "@/features/auth-page/helpers";
import { LogIn } from "@/features/auth-page/login";

export default async function Home() {
  await redirectIfAuthenticated();
  return (
    <main className="container w-full h-screen flex items-center justify-center bg-gradient-to-b from-white dark:from-[#061826] to-[#F0F0F0]/50 dark:to-[#0A234B]/50 transition-colors duration-200 custom-scrollbar">
      <LogIn
        isDevMode={process.env.NODE_ENV === "development"}
        githubEnabled={!!process.env.AUTH_GITHUB_ID}
        entraIdEnabled={!!process.env.AZURE_AD_CLIENT_ID}
      />
    </main>
  );
}

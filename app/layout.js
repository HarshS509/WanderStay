import { Josefin_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import Header from "./_components/Header.js";
import Logo from "./_components/Logo";
import Navigation from "./_components/Navigation";
import { ReservationProvider } from "./_components/ReservationContext.js";

const Josefin = Josefin_Sans({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | WanderStay",
    default: "Welcome | WanderStay",
  },
  description:
    "Luxurious cabin hotel, located in a beautiful mountain range, surrounded by stunning peaks and dark, dense forests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${Josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
        suppressHydrationWarning={true}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

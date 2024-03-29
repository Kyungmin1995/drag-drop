import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { LoginBtn, LogOutBtn } from "@/client/Btn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const sesstion = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body className={inter.className}>
        {sesstion === null || undefined ? (
          <>
            <div className="nav">
              <div>
                <Link href="/register">가입</Link>
                <LoginBtn />
              </div>
            </div>
          </>
        ) : (
          <div className="nav ">
            <div>
              {sesstion.user.name}
              <LogOutBtn />
            </div>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}

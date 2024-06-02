import { ReactNode } from "react";
import TopNav from "../components/TopNav";
import { useLocation } from "react-router-dom";
import SideNav from "../components/SideNav";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100vh]">
      <header>
        <TopNav />
      </header>
      <div
        className={[
          useLocation().pathname === "/" ? "max-w-[1140px]" : "",
          "flex justify-between mx-auto w-full lg:px-2.5 px-0",
        ].join(" ")}
      >
        <div>
          <SideNav />
        </div>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;

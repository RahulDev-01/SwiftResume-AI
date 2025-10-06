import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all duration-300 ${
      isHomePage 
        ? 'bg-white/80 backdrop-blur-md shadow-sm' 
        : 'bg-white shadow-md'
    }`}>
      <Link to={"/"} className="flex items-center">
        <img src="./logo.png" alt="SwiftResume AI" className="h-8 sm:h-10 cursor-pointer" />
        <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">SwiftResume AI</span>
      </Link>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {isSignedIn ? (
          <>
            <Link to={"/dashboard"}>
              <Button 
                variant={isHomePage ? "outline" : "default"}
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton className="custom-user-button" />
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={"/auth/sign-in"}>
              <Button 
                size="sm"
                className={`${
                  isHomePage 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

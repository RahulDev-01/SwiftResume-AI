import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="px-3 py-5 flex justify-between shadow-md">
      <Link to={"/"}>
        <img src="./logo.png" alt="Logo" className="h-10 ml-4 cursor-pointer" />
      </Link>
      {isSignedIn ? (
        <div className="flex gap-4 items-center">
          <Link to={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
          {/* Apply the custom class to the UserButton */}
          <UserButton className="custom-user-button" />
        </div>
      ) : (
        <Link to={"/auth/sign-in"}>
          <Button className="h-10 mr-5 w-29 py-5">Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;

'use client'
import { useState } from "react";
import { Button } from "./ui/button";
export default function StorageAccessRequest() {
  const [accessGranted, setAccessGranted] = useState(false);

  const requestStorageAccess = async () => {
    if (document.requestStorageAccess) {
      try {
        await document.requestStorageAccess();
        console.log("Storage access granted!");
        setAccessGranted(true);
      } catch (error) {
        console.error("Storage access denied.", error);
        setAccessGranted(false);
      }
    } else {
      console.warn("Storage Access API not supported in this browser.");
    }
  };

  return (
    <div>
      
      {!accessGranted ? (
        <Button onClick={requestStorageAccess}>Allow Cookie Access</Button>
      ) : (
        <p>✅ Access Granted! Cookies are now available.</p>
      )}
    </div>
  );
};


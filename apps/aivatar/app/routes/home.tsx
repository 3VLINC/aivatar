import type { Route } from "./+types/home";
import type { MetaArgs } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from '@heroui/react';
import * as QRCode from "qrcode.react";

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const LOCAL_STORAGE_KEYS = {
    FARCASTER_USER: "farcasterUser",
  };

  const [loading, setLoading] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(
    null
  );

  useEffect(() => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.FARCASTER_USER);

    setFarcasterUser(user ? JSON.parse(user) : null);
  }, []);

  useEffect(() => {
    if (farcasterUser && farcasterUser.status === "pending_approval") {
      let intervalId: NodeJS.Timeout;

      const startPolling = () => {
        intervalId = setInterval(async () => {
          try {
            const response = await axios.get(
              `/api/getSigner?signer_uuid=${farcasterUser?.signer_uuid}`
            );
            const user = response.data as FarcasterUser;

            if (user?.status === "approved") {
              // store the user in local storage
              localStorage.setItem(
                LOCAL_STORAGE_KEYS.FARCASTER_USER,
                JSON.stringify(user)
              );

              setFarcasterUser(user);
              clearInterval(intervalId);
            }
          } catch (error) {
            console.error("Error during polling", error);
          }
        }, 2000);
      };

      const stopPolling = () => {
        clearInterval(intervalId);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopPolling();
        } else {
          startPolling();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Start the polling when the effect runs.
      startPolling();

      // Cleanup function to remove the event listener and clear interval.
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        clearInterval(intervalId);
      };
    }
  }, [farcasterUser]);

  const handleSignIn = async () => {
    setLoading(true);
    await createAndStoreSigner();
    setLoading(false);
  };

  const createAndStoreSigner = async () => {
    try {
      const response = await axios.post("/api/generateSigner");
      if (response.status === 200) {
        console.log("response data", response.data);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.FARCASTER_USER,
          JSON.stringify(response.data)
        );
        setFarcasterUser(response.data);
      }
    } catch (error) {
      console.error("API Call failed", error);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      const response = await axios.post("/api/updateLocation", {
        signerUuid: farcasterUser?.signer_uuid,
      });
      console.log("response data", response.data);
    } catch (error) {
      console.error("API Call failed", error);
    }
  };

  return (
    <div>
      {!farcasterUser?.status && (
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? "Loading..." : "Sign in with farcaster"}
        </button>
      )}

      {farcasterUser?.status == "pending_approval" &&
        farcasterUser?.signer_approval_url && (
          <div>
            <QRCode.QRCodeSVG value={farcasterUser.signer_approval_url} />
            <div>OR</div>
            <a
              href={farcasterUser.signer_approval_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to view the signer URL (on mobile)
            </a>
          </div>
        )}
      {farcasterUser && (
        <Button onPress={handleUpdateLocation}>Update Location</Button>
      )}
    </div>
  );
}

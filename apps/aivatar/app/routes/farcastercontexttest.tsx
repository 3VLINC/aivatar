import type { Route } from "./+types/home";
import type { MetaArgs } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from '@heroui/react';
import * as QRCode from "qrcode.react";
import { useFarcasterContext } from "~/providers/Preload";

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
}


export default function Home() {
  const sdk = useFarcasterContext();

  const handleFCSignIn = async () => {

    if (sdk) {
      await sdk.actions.signIn({
        nonce: "123512345",
        expirationTime: '10000',
        notBefore: '0'

      }).then(
      (res) => {
          console.log(res.signature);
      }
    );
  }

  };

  const test = () => {
    if (sdk)  {
      sdk.actions.openUrl('https://www.google.com');
    }
  }

  return (
    <Button onPress={handleFCSignIn}>Sign In</Button>
  )
}

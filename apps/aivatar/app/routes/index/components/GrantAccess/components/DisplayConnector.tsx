import { QRCode } from '@farcaster/auth-kit';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import type { Signer } from '@neynar/nodejs-sdk/build/api';

export function DisplayConnector({
  signer: { signer_approval_url },
}: {
  signer: Signer;
}) {
  if (!signer_approval_url) {
    throw new Error('No signer approval URL provided');
  }
  return (
    <Modal className="bg-white" isOpen={true}>
      <ModalBody>
        <ModalContent>
          <QRCode uri={signer_approval_url} />
          <div>OR</div>
          <a
            href={signer_approval_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to view the signer URL (on mobile)
          </a>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}

import { QRCode } from '@farcaster/auth-kit';
import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@heroui/react';
import type { Signer } from '@neynar/nodejs-sdk/build/api';
import { useAppContext } from '~/providers/AppContext';

export function DisplayConnector({
  signer,
  onClose,
}: {
  signer: Signer | null;
  onClose: () => void;
}) {
  const { type } = useAppContext();

  if (!signer || !signer.signer_approval_url) {
    return null;
  }

  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
    onChange(isOpen) {
      if (!isOpen) {
        onClose();
      }
    },
  });

  let content: JSX.Element | null = null;

  if (type === 'frame') {
    content = (
      <>
        <QRCode uri={signer.signer_approval_url} />
        <Link target="_blank" href={signer.signer_approval_url}>
          Click here to go to the signer approval url:{' '}
        </Link>
      </>
    );
  } else {
    content = <QRCode uri={signer.signer_approval_url} />;
  }

  return (
    <Modal
      className="bg-gray-600 rounded-sm"
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalBody>
          <div className="flex flex-row p-4">
            <div className="flex-1">{content}</div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

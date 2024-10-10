import { Button, Modal, ModalContent, ModalFooter } from "@nextui-org/react";

type PopupProps = Readonly<{
    isOpen: boolean;
    onOpenChange: any;
    children: React.ReactNode;
    scrollBehavior: 'normal' | 'inside' | 'outside';
}>
const Popup = ({ isOpen, onOpenChange, children, scrollBehavior }: PopupProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="bottom-center"
            scrollBehavior={scrollBehavior}
        >
            <ModalContent className="bg-[var(--background)]">
                {(onClose: any) => (
                    <>
                        {children}
                        <ModalFooter>
                            <Button color="primary" variant="shadow" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
Popup.displayName = 'Popup';

export default Popup;

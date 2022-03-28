import React from 'react';
import Modals from './Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function UsageModal({ isOpen, onClose }: Props) {
    return (
        <Modals
            isOpen={isOpen}
            onClose={onClose}
            title="Usage"
            body="Pick a file, upload it, and add text as copyright"
        />
    );
}

export default UsageModal;

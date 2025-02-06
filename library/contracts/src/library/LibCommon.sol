// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library LibCommon {
    string constant SCOPE = 'aivatar';
    
    error MissingStorageMap();

    struct StorageMap {
        uint64 slot;
        uint64 index;
    }

    enum Expression {
        JOY,
        GRATIDUDE,
        LOVE,
        PRIDE,
        HOPE,
        RELIEF,
        AMUSEMENT,
        INSPIRATION,
        CONFIDENCE,
        AWE,
        ANGER,
        SADNESS,
        FEAR,
        JEALOUSY,
        FRUSTRATION,
        LONELINESS,
        GUILT,
        DISGUST,
        SUPRPRISE,
        NOSTALGIA        
    }
}

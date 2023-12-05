import {onValueCreated, onValueDeleted} from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";

initializeApp();

const getRegion = () => {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return {};
  }

  return {region: "europe-west1"};
};

export const onRecordAdded = onValueCreated(
  {
    ...getRegion(),
    ref: "/v-p-app-v1/users/{uid}/records/{vocabId}/{recordId}",
  },
  async (event) => {
    try {
      const db = getDatabase();
      const recordsCountRef = db.ref(
        `v-p-app-v1/users/${event.params.uid}/vocabs/${event.params.vocabId}/recordsCount`
      );
      const recordsCountSnapshot = await recordsCountRef.once("value");
      const recordsCount: number = recordsCountSnapshot.exists() ?
        recordsCountSnapshot.val() :
        0;
      await recordsCountRef.set(recordsCount + 1);
    } catch (error) {
      logger.error(
        `Error happens during update of counter with uid=${event.params.uid} and vocabId=${event.params.vocabId}.`,
        error
      );
    }
  },
);

export const onRecordDeleted = onValueDeleted(
  {
    ...getRegion(),
    ref: "/v-p-app-v1/users/{uid}/records/{vocabId}/{recordId}",
  },
  async (event) => {
    try {
      const db = getDatabase();
      const recordsCountRef = db.ref(
        `v-p-app-v1/users/${event.params.uid}/vocabs/${event.params.vocabId}/recordsCount`
      );
      const recordsCountSnapshot = await recordsCountRef.once("value");
      const recordsCount: number = recordsCountSnapshot.exists() ?
        recordsCountSnapshot.val() :
        1;
      if (!recordsCount) {
        logger.error(
          `Counter for uid=${event.params.uid} and vocabId=${event.params.vocabId} ` +
          "absent or zero and can not be decreased."
        );
        return;
      }
      await recordsCountRef.set(recordsCount - 1);
    } catch (error) {
      logger.error(
        `Error happens during update of counter with uid=${event.params.uid} and vocabId=${event.params.vocabId}.`,
        error
      );
    }
  },
);

export const ROTATION_MYTHS = [
  {
    myth: "active can rotate owner if I just sign hard enough",
    reality:
      "Active cannot change owner. Only current owner (or its multi-sig) can authorize owner updates.",
  },
  {
    myth: "Remove the old key first so there is only one authority",
    reality:
      "Add and verify new keys first. Removing the last valid owner weight can lock the account permanently.",
  },
  {
    myth: "This wizard broadcasts updateauth for me",
    reality:
      "Educational sketches only. Prefer WharfKit session.transact when you intentionally go live.",
  },
] as const;

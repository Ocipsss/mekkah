export const CATEGORIES = {
  KITAB: "Kitab",
  MINYAK: "Minyak",
  KURMA: "Kurma",
};

export const UNIT_OPTIONS = {
  [CATEGORIES.KITAB]: ["pcs", "jilid", "set"],
  [CATEGORIES.MINYAK]: ["pcs", "mili", "set"],
  [CATEGORIES.KURMA]: ["gram", "ons", "kilo", "dus", "pack"],
};

export const PAYMENT_METHODS = ["Cash", "QRIS", "Debit", "Transfer"];

export const SYNC_STATUS = {
  PENDING: "pending",
  SYNCED: "synced",
  FAILED: "failed",
};
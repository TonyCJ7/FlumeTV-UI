/** Config card hash mutation for error/success mappers. */
export type ConfigHashOp = "delete" | "refetch" | "cancel" | "active";

/** Per-hash in-flight UI scope while a hash operation runs. */
export type ConfigMutationScope = "card" | "activeToggle";

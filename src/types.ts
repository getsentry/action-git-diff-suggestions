type PatchObj = {
  /**
   * File where this patch occurs
   */
  file: string;

  /**
   * Starting line number of patch
   */
  start: number;

  /**
   * Ending line number of patch
   */
  end: number;

  /**
   * The patch contents
   */
  lines: string[];
};

export type Patch = {
  removed: PatchObj;
  added: PatchObj;
};

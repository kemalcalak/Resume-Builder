import { v4 as uuidv4 } from "uuid";

export const generateDocUUID = (): string => {
  const uuid = uuidv4().replace(/-/g, "");
  return `${uuid.substring(0, 16)}`;
};

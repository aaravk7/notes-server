export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const isValidString = (str: unknown, len?: number): boolean => {
  return typeof str === "string" && str.trim().length >= (len ?? 3);
};

export const isValidStatus = (tag: unknown) => {
  return tag === "todo" || tag === "inprogress" || tag === "done";
};

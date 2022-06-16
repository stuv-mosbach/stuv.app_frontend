import classNames from "classnames";

export const expandedClasses = (expanded : boolean) => classNames(expanded ? "max-h-[1000vh]" : "max-h-0", "transform overflow-hidden duration-500 ease-in-out");

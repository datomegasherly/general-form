export declare const dateConverter: (
  date: string | Date,
  date_type?: "datetime" | "date" | "time",
  type?: "dec" | "enc" | "pec"
) => string | Date;
export declare const translateForm: ({
  allUp,
  children,
  translate,
  lang,
}: {
  allUp?: boolean | undefined;
  children: any;
  translate: Array<any>;
  lang: string;
}) => string;

export const dateConverter = (
  date: string | Date,
  date_type: "datetime" | "date" | "time" = "datetime",
  /** enc: convert to Date , dec: convert to String */
  type: "dec" | "enc" | "pec" = "dec"
) => {
  switch (type) {
    case "dec":
      if (typeof date !== "string") {
        const ddate = new Date(date.setMinutes(date.getTimezoneOffset()));
        const dmonth = ddate.getMonth() + 1;
        const dday = ddate.getDate();
        const dhour = ddate.getHours();
        const dminute = ddate.getMinutes();
        const dsecond = ddate.getSeconds();
        const date_part = `${ddate.getFullYear()}-${
          dmonth < 10 ? `0${dmonth}` : dmonth
        }-${dday < 10 ? `0${dday}` : dday}`;
        const time_part = `${dhour < 10 ? `0${dhour}` : dhour}:${
          dminute < 10 ? `0${dminute}` : dminute
        }:${dsecond < 10 ? `0${dsecond}` : dsecond}.000Z`;
        return date_type === "datetime"
          ? `${date_part}T${time_part}`
          : date_type === "date"
          ? date_part
          : time_part;
      }
      break;
    case "enc":
      if (typeof date === "string") {
        const rdate =
          date_type === "datetime"
            ? date
            : date_type === "date"
            ? date
            : `2020-01-01T${date}.000Z`;
        //const offset = new Date(rdate).getTimezoneOffset();
        //const main_date = new Date(rdate).setMinutes(offset);
        return rdate;
      }
      break;
    case "pec":
      if (typeof date === "string") {
        const rdate =
          date_type === "datetime"
            ? date
            : date_type === "date"
            ? date
            : `2020-01-01T${date}.000Z`;
        const pdate = new Date(rdate);
        const dmonth = pdate.getMonth();
        const dday = pdate.getDate();
        const dhour = pdate.getHours();
        const dminute = pdate.getMinutes();
        const date_part = `${pdate.getFullYear()}-${
          dmonth < 10 ? `0${dmonth}` : dmonth
        }-${dday < 10 ? `0${dday}` : dday}`;
        const time_part = `${dhour < 10 ? `0${dhour}` : dhour}:${
          dminute < 10 ? `0${dminute}` : dminute
        }`;
        return date_type === "datetime"
          ? `${date_part} ${time_part}`
          : date_type === "date"
          ? date_part
          : time_part;
      }
  }
  return date;
};

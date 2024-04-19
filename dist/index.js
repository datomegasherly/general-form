"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateForm = exports.dateConverter = void 0;
const dateConverter = (date, date_type = "datetime", 
/** enc: convert to Date , dec: convert to String */
type = "dec") => {
    switch (type) {
        case "dec":
            if (typeof date !== "string") {
                const ddate = date; //new Date(date.setMinutes(date.getTimezoneOffset()));
                const dmonth = ddate.getMonth() + 1;
                const dday = ddate.getDate();
                const dhour = ddate.getHours();
                const dminute = ddate.getMinutes();
                const dsecond = ddate.getSeconds();
                const date_part = `${ddate.getFullYear()}-${dmonth < 10 ? `0${dmonth}` : dmonth}-${dday < 10 ? `0${dday}` : dday}`;
                const time_part = `${dhour < 10 ? `0${dhour}` : dhour}:${dminute < 10 ? `0${dminute}` : dminute}:${dsecond < 10 ? `0${dsecond}` : dsecond}.000Z`;
                return date_type === "datetime"
                    ? `${date_part}T${time_part}`
                    : date_type === "date"
                        ? date_part
                        : time_part;
            }
            break;
        case "enc":
            if (typeof date === "string") {
                const rdate = date_type === "datetime"
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
                const rdate = date_type === "datetime"
                    ? date
                    : date_type === "date"
                        ? date
                        : `2020-01-01T${date}.000Z`;
                const pdate = new Date(rdate);
                const dmonth = pdate.getMonth() + 1;
                const dday = pdate.getDate();
                const dhour = pdate.getHours();
                const dminute = pdate.getMinutes();
                const date_part = `${pdate.getFullYear()}-${dmonth < 10 ? `0${dmonth}` : dmonth}-${dday < 10 ? `0${dday}` : dday}`;
                const time_part = `${dhour < 10 ? `0${dhour}` : dhour}:${dminute < 10 ? `0${dminute}` : dminute}`;
                return date_type === "datetime"
                    ? `${date_part} ${time_part}`
                    : date_type === "date"
                        ? date_part
                        : time_part;
            }
    }
    return date;
};
exports.dateConverter = dateConverter;
const translateForm = ({ allUp, children, translate, lang, }) => {
    const types = { b: "font-weight: bold", br: { element: "<br />" } };
    let trans = typeof children === "string" ? children : "";
    const rt = translate.find((tr) => tr.titr === trans.toLowerCase());
    if (rt && rt[lang]) {
        trans = rt[lang];
    }
    if (!trans)
        return "";
    if (allUp) {
        trans = trans.toUpperCase();
    }
    Object.entries(types).map(([type, val]) => {
        if (typeof val !== "string" && val.element) {
            trans = trans.replaceAll(`[${type}/]`, val.element);
        }
        else {
            const exp = `\\[${type}\\][\\w\\d\\s]{1,}\\[\\/${type}\\]`;
            const reg = new RegExp(exp, "g");
            const res = trans.matchAll(reg);
            let done = false;
            while (!done) {
                const p = res.next();
                done = p.done;
                if (p.value) {
                    trans = trans.replace(p.value[0], `<span style="${val}">${p.value[0].split("]")[1].split("[")[0]}</span>`);
                }
            }
        }
    });
    return trans;
};
exports.translateForm = translateForm;

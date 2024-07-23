"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formValidation = exports.translateForm = exports.dateConverter = void 0;
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
// base form validation that can validate all main types
const formValidation = (props) => {
    const { trans, fields, data } = props;
    if (!Array.isArray(fields) || !fields?.length) {
        throw trans("field exist error", { firstUp: true });
    }
    if (!data || typeof data !== "object" || !Object?.keys(data)?.length) {
        throw trans("data exist error", { firstUp: true });
    }
    fields.map((field) => {
        const currentData = data[field.name];
        if (field.required && !currentData) {
            if (field.type === "boolean" && currentData === false) {
                // do nothing
            }
            else if (["integer", "float"].indexOf(field.type) >= 0 &&
                currentData === 0) {
                // do nothing
            }
            else {
                throw `${trans(field.title, { firstUp: true })} ${trans("is required", {
                    firstUp: true,
                })}`;
            }
        }
        if (typeof currentData === "string") {
            if (field.minLength &&
                currentData &&
                currentData?.length < field.minLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is less than", { firstUp: true })} ${field.minLength}`;
            }
            if (field.maxLength &&
                currentData &&
                currentData?.length > field.maxLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is more than", { firstUp: true })} ${field.maxLength}`;
            }
        }
        else if (typeof currentData === "number") {
            if (field.minLength && currentData < field.minLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is less than", { firstUp: true })} ${field.minLength}`;
            }
            if (field.maxLength && currentData > field.maxLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is more than", { firstUp: true })} ${field.maxLength}`;
            }
            if (field.required && !data.hasOwnProperty(field.name)) {
                throw `${trans(field.title, { firstUp: true })} ${trans("is required", {
                    firstUp: true,
                })}`;
            }
        }
        else if (currentData && Array.isArray(currentData)) {
            if (field.minLength && currentData.length < field.minLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is less than", { firstUp: true })} ${field.minLength}`;
            }
            if (field.maxLength && currentData.length > field.maxLength) {
                throw `${trans(field.title, { firstUp: true })} ${trans("length is more than", { firstUp: true })} ${field.maxLength}`;
            }
            if (field.required && !currentData.length) {
                throw `${trans(field.title, { firstUp: true })} ${trans("is required", {
                    firstUp: true,
                })}`;
            }
        }
        switch (field.type) {
            case "string":
            case "textfield":
            case "text":
                break;
            case "url":
                if (field.required &&
                    (!currentData?.startsWith("http://") ||
                        !currentData?.startsWith("https://"))) {
                    throw `${trans(field.title, { firstUp: true })} ${trans("should start with http:// or https://", { firstUp: true })}`;
                }
            case "datetime":
            case "date":
            case "time":
                const fieldCheck = [
                    { id: "lt", name: "less than" },
                    { id: "gt", name: "greater than" },
                    { id: "lte", name: "less than or equal" },
                    { id: "gte", name: "greater than or equal" },
                    { id: "eq", name: "equal with" },
                    { id: "ne", name: "not equal with" },
                ];
                fieldCheck.map((check) => {
                    const { id, name } = check;
                    if (currentData && field[id] && data[field[id]]) {
                        try {
                            const difference = new Date(currentData).getTime() -
                                new Date(data[field[id]]).getTime();
                            const foundField = fields?.find((f) => f.name === field[id]);
                            if (((id === "lt" && difference > 0) ||
                                (id === "lte" && difference >= 0) ||
                                (id === "gt" && difference < 0) ||
                                (id === "gte" && difference <= 0) ||
                                (id === "eq" && difference !== 0) ||
                                (id === "ne" && difference === 0)) &&
                                foundField) {
                                throw `${trans(field.title, { firstUp: true })} ${trans(`should be ${name}`, { firstUp: true })} ${trans(foundField.title, { firstUp: true })}`;
                            }
                        }
                        catch (err) {
                            if (typeof err === "string") {
                                throw err;
                            }
                            else {
                                throw `${trans(field.title, { firstUp: true })} ${trans("date or time error", { firstUp: true })}`;
                            }
                        }
                    }
                });
                break;
            case "integer":
            case "float":
            case "main-image":
                if (data.hasOwnProperty(field.name) && isNaN(Number(currentData))) {
                    throw `${trans(field.title, { firstUp: true })} ${trans("should be number", { firstUp: true })}`;
                }
                break;
            case "boolean":
                if (field.required && !data.hasOwnProperty(field.name)) {
                    throw `${trans(field.title, { firstUp: true })} ${trans("is required", { firstUp: true })}`;
                }
                if (data.hasOwnProperty(field.name) &&
                    typeof currentData !== "boolean") {
                    throw `${trans(field.title, { firstUp: true })} ${trans("should be boolean", { firstUp: true })}`;
                }
                break;
            case "relation":
                if (field.relation === "oneToOne") {
                    if (!field?.target?.fieldsBox) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("field type error", { firstUp: true })}`;
                    }
                    if (field.append) {
                        (0, exports.formValidation)({ trans, fields: field.target.fieldsBox, data });
                    }
                    else if (currentData &&
                        (!currentData.hasOwnProperty("label") ||
                            !currentData.hasOwnProperty("value"))) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("error in data", { firstUp: true })}`;
                    }
                    else if (!currentData && field.required) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("is required", { firstUp: true })}`;
                    }
                    else if (currentData && field.required && !currentData?.value) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("is required", { firstUp: true })}`;
                    }
                }
                if (field.relation === "oneToMany") {
                    if (!field?.target?.fieldsBox) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("field type error", { firstUp: true })}`;
                    }
                    if (field.selection) {
                        if (!Array.isArray(currentData)) {
                            throw `${trans(field.title, { firstUp: true })} ${trans("error in data", { firstUp: true })}`;
                        }
                        currentData.map((cdata) => {
                            (0, exports.formValidation)({
                                trans,
                                fields: field.target.fieldsBox,
                                data: cdata,
                            });
                        });
                    }
                    else if (currentData && !Array.isArray(currentData)) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("error in data", { firstUp: true })}`;
                    }
                    else if (currentData && Array.isArray(currentData)) {
                        currentData.map((cdata) => {
                            if (!cdata ||
                                !cdata?.hasOwnProperty("label") ||
                                !cdata?.hasOwnProperty("value")) {
                                throw `${trans(field.title, { firstUp: true })} ${trans("error in data", { firstUp: true })}`;
                            }
                            else if (!cdata && field.required) {
                                throw `${trans(field.title, { firstUp: true })} ${trans("is required", { firstUp: true })}`;
                            }
                            else if (cdata && field.required && !cdata?.value) {
                                throw `${trans(field.title, { firstUp: true })} ${trans("is required", { firstUp: true })}`;
                            }
                        });
                    }
                }
                break;
            case "upload":
                if (currentData &&
                    typeof currentData === "object" &&
                    currentData?.files) {
                    const numberOfFields = currentData?.files?.length -
                        (currentData?.deleted ? currentData.deleted.length : 0);
                    if (field.minFiles && numberOfFields < field.minFiles) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("length is less than", { firstUp: true })} ${field.minFiles}`;
                    }
                    if (field.maxFiles && numberOfFields > field.maxFiles) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("length is more than", { firstUp: true })} ${field.maxFiles}`;
                    }
                }
                else if (currentData && Array.isArray(currentData)) {
                    if (field.minFiles && currentData.length < field.minFiles) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("length is less than", { firstUp: true })} ${field.minFiles}`;
                    }
                    if (field.maxFiles && currentData.length > field.maxFiles) {
                        throw `${trans(field.title, { firstUp: true })} ${trans("length is more than", { firstUp: true })} ${field.maxFiles}`;
                    }
                }
                break;
        }
    });
};
exports.formValidation = formValidation;

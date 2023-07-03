export const translateForm = ({
  allUp,
  children,
  translate,
  lang,
}: {
  allUp?: boolean;
  children: any;
  translate: Array<any>;
  lang: string;
}) => {
  const types = { b: "font-weight: bold", br: { element: "<br />" } };
  let trans: string = typeof children === "string" ? children : "";
  const rt = translate.find(
    (tr: { titr: string }) => tr.titr === trans.toLowerCase()
  );
  if (rt && rt[lang]) {
    trans = rt[lang];
  }
  if (!trans) return "";
  if (allUp) {
    trans = trans.toUpperCase();
  }
  Object.entries(types).map(([type, val]) => {
    if (typeof val !== "string" && val.element) {
      trans = trans.replaceAll(`[${type}/]`, val.element);
    } else {
      const exp = `\\[${type}\\][\\w\\d\\s]{1,}\\[\\/${type}\\]`;
      const reg = new RegExp(exp, "g");
      const res = trans.matchAll(reg);
      let done: any = false;
      while (!done) {
        const p = res.next();
        done = p.done;
        if (p.value) {
          trans = trans.replace(
            p.value[0],
            `<span style="${val}">${
              p.value[0].split("]")[1].split("[")[0]
            }</span>`
          );
        }
      }
    }
  });
  return trans;
};

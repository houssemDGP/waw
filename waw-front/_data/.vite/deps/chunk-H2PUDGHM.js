import {
  normalizeDates,
  startOfWeek
} from "./chunk-AIQRINQ5.js";

// node_modules/date-fns/isSameWeek.js
function isSameWeek(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options == null ? void 0 : options.in,
    laterDate,
    earlierDate
  );
  return +startOfWeek(laterDate_, options) === +startOfWeek(earlierDate_, options);
}

export {
  isSameWeek
};
//# sourceMappingURL=chunk-H2PUDGHM.js.map

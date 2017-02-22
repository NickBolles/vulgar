import moment = require("moment");
/**
 * Created by Nick on 2/14/2017.
 */


export function getTimestamp(val?: moment.Moment | number) {
  if (val) {
    return moment(val).valueOf();
  }
  return moment.utc().valueOf();
}

export function parseTimestamp(val) {
  return moment(val).utc();
}

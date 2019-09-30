import moment from 'moment'

export function getLastUpdate(time) {
  return moment(time).fromNow()
}
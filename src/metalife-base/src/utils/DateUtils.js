export function formatDate({time, format = 'YY-MM-DD hh:mm:ss'}) {
  if (!time) {
    return '--';
  }
  let timeNum = Number(time);
  if (timeNum.toString().length === 10) {
    timeNum = timeNum * 1000;
  }
  const date = new Date(timeNum);

  const year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  const preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index;
  }); //开个长度为10的数组 格式为 00 01 02 03
  const newTime = format
    .replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
}

//拿到地址栏？后面参数
export const getUrlKey = name => {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
        location.href
      ) || [, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
};

//有关时间的函数
// 年月日
export const getTime = time => {
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  return `${year}-${month}-${date}`;
};
//年月日时分
export const getTimeHour = time => {
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  return `${year}-${month}-${date} ${hours}:${minutes}`;
};
//年月日时分秒
export const getTimeSeconds = time => {
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

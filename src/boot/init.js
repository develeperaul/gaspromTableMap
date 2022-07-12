export default ({ app }) => {
  app.config.globalProperties.$filters = {
    prettyAmount(value) {
      if (typeof value !== "string") return "";
      let [left, right = ""] = value.split(".");
      const sign = left[0] === "-" || left[0] === "+" ? left[0] : "";
      if (sign) left = left.substring(1);
      console.log(sign);
      const clearLeft = left.replace(/[^0-9]/g, "");
      if (!clearLeft) return value;
      const matched = (right || left).match(/[^0-9](.*?)+/);
      const tail = (matched && matched[0]) || "";

      let prettyPart = clearLeft.match(/.{1,3}(?=(.{3})*$)/g).join(" ");

      if (!right) return sign + prettyPart + tail;
      return sign + prettyPart + "." + right.replace(/[^0-9]/g, "") + tail;
    },
  };
};
// console.log(Vue);
// Vue.filter("prettyAmount", function (value) {
//   if (typeof value !== "string") return "";
//   let [left, right = ""] = value.split(".");
//   const sign = left[0] === "-" || left[0] === "+" ? left[0] : "";
//   if (sign) left = left.substring(1);
//   console.log(sign);
//   const clearLeft = left.replace(/[^0-9]/g, "");
//   if (!clearLeft) return value;
//   const matched = (right || left).match(/[^0-9](.*?)+/);
//   const tail = (matched && matched[0]) || "";

//   let prettyPart = clearLeft.match(/.{1,3}(?=(.{3})*$)/g).join(" ");

//   if (!right) return sign + prettyPart + tail;
//   return sign + prettyPart + "." + right.replace(/[^0-9]/g, "") + tail;
// });

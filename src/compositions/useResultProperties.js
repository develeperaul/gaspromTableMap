import { computed } from "vue";

export default function async(list) {
  const summProperty = (property) => {
    if (list.length === 0) return "0";
    return String(
      list.reduce((a, b) => {
        return a + +b[property];
      }, 0)
    );
  };

  const average = (secondProperty, property) => {
    if (list && list.length > 1) {
      console.log(secondProperty);
      return Math.ceil(
        (list.reduce((a, b) => a + +b[secondProperty], 0) /
          list.reduce((a, b) => a + +b[property], 0)) *
          100
        // list.value.reduce((a, b) => a + +b[property], 0) / divider
      );
    }
  };
  const row = {
    id: "0",
    name: "Итого по <br/> Республике <br/> Башкортостан",
    prop1: "0",
    prop2: summProperty("prop2"),
    prop3: summProperty("prop3"),
    prop4: summProperty("prop4"),
    prop5: computed(() => {
      return average("prop4", "prop3");
    }),
    prop6: summProperty("prop6"),
    prop7: computed(() => {
      return average("prop6", "prop4");
    }),
    prop8: summProperty("prop8"),
    prop9: computed(() => {
      return average("prop8", "prop6");
    }),
    prop10: summProperty("prop10"),
    prop11: computed(() => {
      return average("prop10", "prop6");
    }),
    prop12: summProperty("prop12"),
    prop13: computed(() => {
      return average("prop12", "prop6");
    }),
    prop14: summProperty("prop14"),
    prop15: computed(() => {
      return average("prop14", "prop6");
    }),
    prop16: summProperty("prop16"),
    prop17: computed(() => {
      return average("prop16", "prop6");
    }),
    prop18: summProperty("prop18"),
    prop19: computed(() => {
      return average("prop18", "prop6");
    }),
  };
  return {
    row,
  };
}

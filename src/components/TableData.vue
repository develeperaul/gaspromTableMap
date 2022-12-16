<template>
  <div>
    <q-table
      class="my-sticky-dynamic"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            v-html="col.label"
          >
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props" v-html="props.row.name"> </q-td>
          <q-td key="prop2" :props="props" v-html="props.row.prop2"> </q-td>
          <q-td key="prop3" :props="props" v-html="props.row.prop3"> </q-td>
          <q-td key="prop4" :props="props" v-html="props.row.prop4"> </q-td>
          <q-td key="prop5" :props="props" v-html="props.row.prop5"> </q-td>
          <q-td key="prop6" :props="props" v-html="props.row.prop6"> </q-td>

          <q-td key="prop7" :props="props" v-html="props.row.prop7"> </q-td>
          <q-td key="prop8" :props="props" v-html="props.row.prop8"> </q-td>
          <q-td key="prop9" :props="props" v-html="props.row.prop9"> </q-td>
          <q-td key="prop10" :props="props" v-html="props.row.prop10"> </q-td>
          <q-td key="prop11" :props="props" v-html="props.row.prop11"> </q-td>
          <q-td key="prop12" :props="props" v-html="props.row.prop12"> </q-td>
          <q-td key="prop13" :props="props" v-html="props.row.prop13"> </q-td>

          <q-td key="prop14" :props="props" v-html="props.row.prop14"> </q-td>
          <q-td key="prop15" :props="props" v-html="props.row.prop15"> </q-td>
          <q-td key="prop16" :props="props" v-html="props.row.prop16"> </q-td>
          <q-td key="prop17" :props="props" v-html="props.row.prop17"> </q-td>
          <q-td key="prop18" :props="props" v-html="props.row.prop18"> </q-td>
          <q-td key="prop19" :props="props" v-html="props.row.prop19"> </q-td>
        </q-tr>
      </template>
      <!-- {
        name: "rb",
        required: true,
        label: "Итого <br/> по Респбулике Башкортостан",
        align: "left",
        field: (row) => row.rb,
        format: (val) => `${val}`,
        sortable: true,
      }, -->
    </q-table>
  </div>
</template>
<script>
import { computed } from "vue";
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    rowRb: {
      type: Object,
      default: {},
    },
  },

  setup(props) {
    const columns = [
      {
        name: "name",
        required: true,
        label: "Район, <br/>город",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "prop2",
        align: "center",
        label: "Количество <br/> земельных <br/> участков",
        field: (row) => row.prop2,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop3",
        align: "center",
        label: "Количество <br/> ИЖС",
        field: (row) => row.prop3,
        sortable: true,
      },
      {
        name: "prop4",
        align: "center",
        label: "Количество <br/> принятых <br/> заявок",
        field: (row) => row.prop4,
        sortable: true,
      },
      {
        name: "prop5",
        align: "center",
        label: "% от <br/> количества <br/> ИЖС",
        // label: "Количество <br/> заключенных <br/> договоров",
        field: (row) => row.prop5,
        sortable: true,
      },
      {
        name: "prop6",
        align: "center",
        label: "Количество <br/> заключенных <br/> договоров",
        field: (row) => row.prop6,
        sortable: true,
      },
      {
        name: "prop7",
        align: "center",
        label: "% от <br/> принятых <br/> заявок",
        field: (row) => row.prop7,
        sortable: true,
      },
      {
        name: "prop8",
        align: "center",
        label: "Количество <br/> исполненных <br/> до границ",
        // label: "% от <br/> закл. дог.",
        field: (row) => row.prop8,
        sortable: true,
      },
      {
        name: "prop9",
        align: "center",
        label: "% от <br/> заключенных <br/> договоров",

        field: (row) => row.prop9,
        sortable: true,
      },
      {
        name: "prop10",
        align: "center",
        label: "Количество <br/> подключенных",

        field: (row) => row.prop10,
        sortable: true,
      },
      {
        name: "prop11",
        align: "center",
        label: "% от <br/> заключенных <br/> договоров",
        field: (row) => row.prop11,
        sortable: true,
      },
      {
        name: "prop12",
        align: "center",
        label: "Количество <br/>  комплексных <br/> договоров",

        field: (row) => row.prop12,
        sortable: true,
      },
      {
        name: "prop13",
        align: "center",
        label: "% от <br/> заключенных <br/> договоров",
        field: (row) => row.prop13,
        sortable: true,
      },
      {
        name: "prop14",
        align: "center",
        label:
          "Прогноз <br/> просроченных <br/> договоров <br/> на конец <br/> текущего месяца",
        field: (row) => row.prop14,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop15",
        align: "center",
        label: "% <br/> от заключенных <br/> договоров",
        field: (row) => row.prop15,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop16",
        align: "center",
        label:
          "Прогноз <br/> просроченных <br/> договоров <br/> на конец <br/> 2 месяца",
        field: (row) => row.prop16,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop17",
        align: "center",
        label: "% <br/> от заключенных <br/> договоров",
        field: (row) => row.prop17,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop18",
        align: "center",
        label:
          "Прогноз<br/> просроченных <br/> договоров на конец <br/> 3 месяца",
        field: (row) => row.prop18,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "prop19",
        align: "center",
        label: "% <br/> от заключенных <br/> договоров",
        field: (row) => row.prop19,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];
    const summProperty = (property) => {
      if (props.list.length === 0) return 0;
      return props.list.reduce((a, b) => a + +b[property], 0);
    };
    const rows = computed(() => {
      if (props.list.length === 0) return null;
      return [props.rowRb, ...props.list];
    });
    return {
      columns,
      rows,
    };
  },
};

// const props =
// });
</script>
<style scoped lang="scss">
.my-sticky-dynamic {
  /* height or max-height is important */
  max-height: 600px;
  height: 100%;

  @media (max-width: 780px) {
    max-height: 80vh;
  }

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #fff;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  /* this will be the loading indicator */
  thead tr:last-child th

  /* height of all previous header rows */ {
    top: 48px;
  }

  thead tr:first-child th {
    top: 0;
  }

  td:first-child {
    background-color: #fff !important;
  }

  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child {
    /* highest z-index */
    z-index: 3;
  }

  td:first-child {
    z-index: 1;
  }

  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
}
</style>

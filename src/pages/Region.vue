<template>
  <q-page class="map__content">
    <div class="map__content-left column no-wrap justify-between">
      <div class="full-height relative-position" v-if="choice === 'map'">
        <div class="map__title text-center">
          <b v-if="sortProp === 'prop7'">Доля заключенных договоров, %</b>
          <b v-else-if="sortProp === 'prop9'"
            >Доля заявок, исполненных до границ, %</b
          >
          <b v-else-if="sortProp === 'prop11'">Доля подключенных, %</b>
        </div>
        <!-- <q-skeleton height="100%" v-if="isLoading" /> -->
        <Map :array="mergeCounts" />
        <div class="ratios">
          <div class="ratios__item">
            <div
              v-if="countTo50"
              class="ratios__region-count"
              style="background: #17375e"
            >
              <!-- {{ countTo50.length }} -->
            </div>
            <div>Более 50%</div>
          </div>
          <q-separator></q-separator>
          <div class="ratios__item">
            <div
              v-if="count25from50"
              class="ratios__region-count"
              style="background: #558dd6"
            >
              <!-- {{ count25from50.length }} -->
            </div>
            <div>25-50%</div>
          </div>
          <q-separator></q-separator>
          <div class="ratios__item">
            <div
              v-if="countTo25"
              class="ratios__region-count"
              style="background: #8eb4e3"
            >
              <!-- {{ countTo25.length }} -->
            </div>
            <div>Менее 25%</div>
          </div>
        </div>
      </div>

      <q-table
        v-if="choice === 'table'"
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
      </q-table>
      <div class="btn-group">
        <q-btn
          :color="choice === 'map' ? 'primary' : 'white'"
          :text-color="choice === 'map' ? '' : 'black'"
          label="Карта"
          @click="choice = 'map'"
        />
        <q-btn
          :color="choice === 'table' ? 'primary' : 'white'"
          :text-color="choice === 'table' ? '' : 'black'"
          label="Таблица"
          @click="choice = 'table'"
        />
      </div>
    </div>
    <div class="map__content-right flex column" v-if="choice === 'map'">
      <div class="text-center q-mb-xl">
        <b class="relative-position">
          <q-btn
            v-if="district"
            color="primary"
            icon="home"
            @click="$router.push({ path: '/' })"
            class="button-home"
          />
          {{ name }}
        </b>
      </div>
      <div class="cards q-mt-xl q-mb-xl">
        <div class="text-center">
          <q-card flat bordered style="width: 100%">
            <q-card-section>
              <div class="card-title">Количество принятых заявок</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-skeleton v-if="isLoading" type="rect" />
              <template v-else>
                <b> {{ ihs }} </b>
              </template>
            </q-card-section>
          </q-card>

          <!-- <div>Количество ИЖС</div>
          <div>
            <b> {{ ihs }} </b>
          </div> -->
        </div>
        <div class="text-center">
          <q-card
            flat
            bordered
            style="width: 100%"
            @click="updateCard('prop7')"
            :style="!district ? { cursor: 'pointer' } : ''"
          >
            <q-card-section>
              <div class="card-title">
                Количество заключенных договоров <br />
                (% от принятых заявок)
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-skeleton v-if="isLoading" type="rect" />
              <template v-else>
                <b> {{ accepted }} </b>
              </template>
            </q-card-section>
          </q-card>
        </div>

        <div class="text-center q-mb-md">
          <q-card
            flat
            bordered
            style="width: 100%"
            @click="updateCard('prop9')"
            :style="!district ? { cursor: 'pointer' } : ''"
          >
            <q-card-section>
              <div class="card-title">
                Количество исполненных до границ <br />
                (% от заключенных договоров)
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-skeleton v-if="isLoading" type="rect" />
              <template v-else>
                <b> {{ executedLimit }} </b>
              </template>
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center q-mb-md">
          <q-card
            flat
            bordered
            style="width: 100%"
            @click="updateCard('prop11')"
            :style="!district ? { cursor: 'pointer' } : ''"
          >
            <q-card-section>
              <div class="card-title">
                Количество подключенных <br />
                (% от заключенных договоров)
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-skeleton v-if="isLoading" type="rect" />
              <template v-else>
                <b> {{ connections }} </b>
              </template>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row"></div>
    </div>
  </q-page>
</template>

<script>
import Vue, { defineComponent, ref, computed, inject } from "vue";
import Map from "src/components/CardMap.vue";
import Table from "src/components/DataTable.vue";
import ky from "ky";
// import json from "/public/data/data.json";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "Region",
  props: {
    district: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const prettyAmount = inject("prettyAmount");
    const isLoading = ref(true);
    const choice = ref("map");
    const list = ref([]);
    const $q = useQuasar();
    const message = ref(null);
    const sortProp = ref("prop9");
    const getDataRegions = async () => {
      try {
        isLoading.value = true;
        const res = await ky("/api/list.php").json();
        // const res = json;
        if (res.length === 0) {
          $q.notify({
            type: "negative",
            message: "Данные не заполнены!",
          });
        }
        list.value = res;
        return res;
      } catch (e) {
        console.log(e);
      } finally {
        if (list.value.length === 0) isLoading.value = true;
        else isLoading.value = false;
      }
    };

    getDataRegions();

    const data = computed(() => {
      const district = props.district;
      if (list.value.length === 0) return null;
      else {
        if (district && district.length > 0) {
          const districtData = list.value.find((item) => {
            return item.id == district;
          });
          return [districtData];
        } else {
          return list.value;
        }
      }
    });
    const summ = (data, property) => {
      if (data.value && data.value.length === 1) {
        return data.value[0][property];
      }
      if (data.value && data.value.length > 1) {
        return prettyAmount(
          String(list.value.reduce((a, b) => a + +b[property], 0))
        );
      }
    };
    const average = (data, secondProperty, property, divider = 63) => {
      if (data.value && data.value.length === 1) {
        return `${data.value[0][secondProperty]} (${data.value[0][property]}%)`;
      }
      if (data.value && data.value.length > 1) {
        return `${summ(data, secondProperty)} (${Math.ceil(
          list.value.reduce((a, b) => a + +b[property], 0) / divider
        )}%)`;
      }
    };

    const countTo25 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter((item) => +item[sortProp.value] < 25)
        .map((item) => {
          return { ...item, to25: true };
        });
    });
    const count25from50 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter(
          (item) => +item[sortProp.value] >= 25 && +item[sortProp.value] < 50
        )
        .map((item) => {
          return { ...item, to25from50: true };
        });
    });
    const countTo50 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter((item) => +item[sortProp.value] > 50)
        .map((item) => {
          return { ...item, to50: true };
        });
    });

    const columns = [
      {
        name: "name",
        required: true,
        label: "Район,город",
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
        label: "% от <br/> закл. договоров",

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
    ];
    const rows = computed(() => {
      if (list.value.length === 0) return null;
      return list.value;
    });

    const ihs = computed(() => {
      return summ(data, "prop4");
    });

    const updateCard = (property) => {
      if (!props.district) sortProp.value = property;
    };
    return {
      prettyAmount,
      isLoading,
      data,
      ihs,
      accepted: computed(() => {
        return average(data, "prop6", "prop7");
      }),
      executedLimit: computed(() => {
        return average(data, "prop8", "prop9");
      }),
      connections: computed(() => {
        return average(data, "prop10", "prop11");
      }),
      name: computed(() => {
        if (data.value && data.value.length === 1) {
          return data.value[0].name;
        }
        return "Республика Башкортостан";
      }),
      choice,
      countTo25,
      count25from50,
      countTo50,
      mergeCounts: computed(() => [
        ...countTo25.value,
        ...count25from50.value,
        ...countTo50.value,
      ]),
      columns,
      rows,
      sortProp,
      updateCard,
    };
  },
  components: {
    Map,
    Table,
  },
});
</script>
<style scoped lang="scss">
.map__content {
  display: flex;
  padding: 50px 100px;
  @media (max-width: 780px) {
    padding: 20px;
    flex-direction: column;
    gap: 20px;
  }
  &-right,
  &-left {
    width: 100%;
  }

  &-right {
    align-self: center;
  }
}

.map__title {
  margin-bottom: 20px;
  font-size: 38px;
  @media (max-width: 780px) {
    margin-bottom: 15px;
    font-size: 14px;
  }
}
.ratios {
  // display: grid;
  // grid-template-columns: repeat(3, minmax(0, 135px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-weight: 700;
  text-align: left;

  width: 170px;
  position: absolute;
  left: 80px;
  bottom: 0;

  @media (max-width: 780px) {
    left: 0px;
    width: 100px;
  }
}
.ratios__item {
  display: flex;
  align-items: center;
  gap: 20px;
  @media (max-width: 780px) {
    gap: 5px;
  }
  & > div {
    font-size: 16px;
    @media (max-width: 780px) {
      font-size: 12px;
    }
  }
}
.ratios__region-count {
  font-weight: 500;
  padding: 15px 4px;
  color: #fff;
  background-color: red;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 780px) {
    padding: 2px;
    height: 16px;
    width: 16px;
  }
}
.my-sticky-dynamic {
  /* height or max-height is important */
  max-height: 600px;
  height: 100%;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */ {
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
}
.button-home {
  position: absolute;
  left: 0;
  transform: translateX(calc(-100% - 20px));
  @media (max-width: 780px) {
    font-size: 10px;
    top: 50%;
    padding: 5px;
    transform: translate(calc(-100% - 10px), -50%);
  }
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;
}
.card-title {
  font-size: 18px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 780px) {
    font-size: 10px;
  }
}

.btn-group {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  @media (max-width: 780px) {
    margin-top: 10px;
    gap: 5px;
  }
  & > button {
    @media (max-width: 780px) {
      font-size: 10px;
    }
  }
}
</style>

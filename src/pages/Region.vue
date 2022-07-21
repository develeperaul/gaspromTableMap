<template>
  <q-page class="map__content">
    <div class="map__content-left column no-wrap justify-between">
      <div class="full-height relative-position" v-if="choice === 'map'">
        <div class="map__title text-center">
          <b v-if="sortProp === 'prop4'"><br />Количество принятых заявок</b>
          <b v-else-if="sortProp === 'prop7'"
            >Доля заключенных <br />
            договоров, %</b
          >
          <b v-else-if="sortProp === 'prop9'"
            >Доля заявок, <br />
            исполненных до границ, %</b
          >
          <b v-else-if="sortProp === 'prop11'"> <br />Доля подключенных, % </b>
          <b v-else-if="sortProp === 'prop13'">
            Доля комлексных <br />
            договоров, %
          </b>
        </div>
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
            <div>
              более
              {{
                sortProp === "prop4" ? legendData.last : `${legendData.last}%`
              }}
            </div>
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
            <div>
              {{
                sortProp === "prop4"
                  ? `${legendData.first}-${legendData.last}`
                  : `${legendData.first}-${legendData.last}%`
              }}
            </div>
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
            <div>
              менее
              {{
                sortProp === "prop4" ? legendData.first : `${legendData.first}%`
              }}
            </div>
          </div>
        </div>
      </div>
      <TableData v-if="choice === 'table'" :rowRb="rowRb" :list="list" />
      <div class="btn-group" v-if="choice === 'table'">
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
        <q-btn color="primary" text-color="white">
          <a :href="linkXML" download target="_blank">Выгрузить Excel</a>
        </q-btn>
      </div>
    </div>
    <div class="map__content-right flex column" v-if="choice === 'map'">
      <div class="indicator-title q-mb-md" v-if="district">
        <q-btn color="primary">
          <b class="">
            {{ name }}
          </b>
        </q-btn>
        <q-btn
          color="white"
          text-color="black"
          @click="$router.push({ path: '/' })"
        >
          <b class=""> Республика Башкортостан </b>
        </q-btn>
      </div>
      <div class="q-mb-md text-center" v-else>
        <b class="" style="font-size: 35px"> Республика Башкортостан </b>
      </div>
      <div class="cards q-mt-xl q-mb-xl">
        <div class="text-center card-center">
          <q-card class="card" flat bordered style="width: 100%">
            <q-card-section
              class="card__top"
              :class="{ 'card-title__button': !district }"
              :style="[
                !district ? { cursor: 'pointer' } : '',
                sortProp == 'prop4' ? { 'background-color': '#fff' } : '',
              ]"
              @click="updateCard('prop4', 500, 1000)"
            >
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
        </div>

        <div class="text-center">
          <q-card class="card" flat bordered style="width: 100%">
            <q-card-section
              class="card-title"
              :class="{ 'card-title__button': !district }"
              :style="[
                !district ? { cursor: 'pointer' } : '',
                sortProp == 'prop7' ? { 'background-color': '#fff' } : '',
              ]"
              @click="updateCard('prop7', 90, 95)"
            >
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
        <div class="text-center">
          <q-card class="card" flat bordered style="width: 100%">
            <q-card-section
              class="card__top"
              :class="{ 'card-title__button': !district }"
              @click="updateCard('prop13', 25, 75)"
              :style="[
                !district ? { cursor: 'pointer' } : '',
                sortProp == 'prop13' ? { 'background-color': '#fff' } : '',
              ]"
            >
              <div class="card-title">
                Количество комплексных договоров <br />
                (% от заключенных договоров)
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-skeleton v-if="isLoading" type="rect" />
              <template v-else>
                <b> {{ complex }} </b>
              </template>
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center q-mb-md">
          <q-card class="card" flat style="width: 100%">
            <q-card-section
              class="card-title"
              :class="{ 'card-title__button': !district }"
              @click="updateCard('prop9')"
              :style="[
                !district ? { cursor: 'pointer' } : '',
                sortProp == 'prop9' ? { 'background-color': '#fff' } : '',
              ]"
            >
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
          <q-card class="card" flat bordered style="width: 100%">
            <q-card-section
              class="card-title"
              :class="{ 'card-title__button': !district }"
              @click="updateCard('prop11')"
              :style="[
                !district ? { cursor: 'pointer' } : '',
                sortProp == 'prop11' ? { 'background-color': '#fff' } : '',
              ]"
            >
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
      <q-skeleton v-if="isLoadingDate" type="rect" width="150px" />
      <p v-else>По состоянию на {{ date }}</p>
      <div class="btn-group" style="justify-content: center">
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
      <div class="row"></div>
    </div>
  </q-page>
</template>

<script>
import Vue, { defineComponent, ref, computed, inject } from "vue";
import Map from "src/components/CardMap.vue";
import TableData from "src/components/TableData.vue";
import ky from "ky";
// import json from "/public/data/data.json";
import useResultProperties from "src/compositions/useResultProperties.js";
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
    const isLoadingDate = ref(true);
    const choice = ref("map");
    const list = ref([]);
    const rowRb = ref({});
    const date = ref(null);
    const linkXML = ref(null);
    const $q = useQuasar();
    const message = ref(null);
    const sortProp = ref("prop9");
    const legendData = ref({
      first: 25,
      last: 50,
    });
    const getDataRegions = async () => {
      try {
        isLoading.value = true;
        isLoadingDate.value = true;
        // const res = await ky("/api/list.php").json();
        const requests = await Promise.all([
          ky("/api/date.php").json(),
          ky("/api/list.php").json(),
          ky("/api/export.php").json(),
        ]);

        date.value = requests[0][0].date;
        // const date = await ky("http://gazstat.danat.su/api/date.php").json();
        // date.value = requests[0].date
        console.log(requests[1]);
        const res = requests[1];
        if (res.length === 0) {
          $q.notify({
            type: "negative",
            message: "Данные не заполнены!",
          });
        }
        linkXML.value = requests[2][0].url;
        const { row } = useResultProperties(res);
        rowRb.value = row;
        list.value = res;
        return res;
      } catch (e) {
        console.log(e);
      } finally {
        if (list.value.length === 0) isLoading.value = true;
        else isLoading.value = false;
        if (list.value.length === 0) isLoadingDate.value = true;
        else isLoadingDate.value = false;
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
    // const average = (data, secondProperty, property, divider = 63) => {
    const average = (data, secondProperty, property) => {
      if (data.value && data.value.length === 1) {
        return `${data.value[0][secondProperty]} (${data.value[0][property]}%)`;
      }
      if (data.value && data.value.length > 1) {
        console.log(secondProperty);
        return `${summ(data, secondProperty)}
         (${Math.ceil(
           (list.value.reduce((a, b) => a + +b[secondProperty], 0) /
             list.value.reduce((a, b) => a + +b[property], 0)) *
             100
           // list.value.reduce((a, b) => a + +b[property], 0) / divider
         )}%)`;
      }
    };

    const countTo25 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter((item) => +item[sortProp.value] < legendData.value.first)
        .map((item) => {
          return { ...item, to25: true };
        });
    });
    const count25from50 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter(
          (item) =>
            +item[sortProp.value] >= legendData.value.first &&
            +item[sortProp.value] < legendData.value.last
        )
        .map((item) => {
          return { ...item, to25from50: true };
        });
    });
    const countTo50 = computed(() => {
      if (list.value.length === 0) return [];
      return list.value

        .filter((item) => +item[sortProp.value] > legendData.value.last)
        .map((item) => {
          return { ...item, to50: true };
        });
    });

    const ihs = computed(() => {
      return summ(data, "prop4");
    });

    const updateCard = (property, first = 25, last = 50) => {
      if (!props.district) {
        legendData.value = {
          first,
          last,
        };
        sortProp.value = property;
      }
    };

    return {
      linkXML,
      prettyAmount,
      isLoading,
      isLoadingDate,
      data,
      date,
      ihs,
      accepted: computed(() => {
        return average(data, "prop6", "prop4");
      }),
      executedLimit: computed(() => {
        return average(data, "prop8", "prop6");
      }),
      complex: computed(() => {
        return average(data, "prop12", "prop6");
      }),
      connections: computed(() => {
        return average(data, "prop10", "prop6");
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
      sortProp,
      updateCard,
      list,
      rowRb,
      legendData,
    };
  },
  components: {
    Map,
    TableData,
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
  left: 180px;
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
  thead tr:first-child th

    /* bg color is important for th; just specify one */ {
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
  transform: translate(calc(-100% - 10px), -50%);
  top: 50%;
  @media (max-width: 780px) {
    font-size: 10px;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 780px) {
    font-size: 10px;
  }
  &__button {
    border-radius: 50px !important;
    background: #8eb4e3;
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

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__top {
    flex-grow: 1;
  }
  &-center {
    grid-column: 2 span / 2 span;
    place-self: center;
  }
}
a {
  text-decoration: none;
  color: #fff;
}
.indicator-title {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 30px;
  .button {
  }
  & > * {
    font-size: 16px;

    &:first-child {
      justify-self: end;
    }
  }
}
</style>

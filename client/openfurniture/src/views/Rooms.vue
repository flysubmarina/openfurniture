<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="6">
        <h1 class="my-4">Buy rooms</h1>
        <b-card v-if="rooms.length == 0">
          <p class="card-text text-center">No availiable rooms</p>
        </b-card>
        <template v-for="room in rooms">
          <b-card class="mb-1" :key="room[0]">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn
                :disabled="isBusy"
                block
                href="#"
                v-b-toggle="'collapse'+room[0]"
                variant="info"
              >Room number: {{Object.values(room[1])[0][0].num}}</b-btn>
            </b-card-header>
            <b-collapse :id="'collapse'+room[0]" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-group deck>
                  <b-card
                    v-for="(furniture,index) in Object.values(room[1])"
                    :key="index"
                    :title="furniture[0].name"
                    :img-src="furniture[0].src"
                    img-alt="Image"
                    img-top
                    tag="article"
                    style="max-width: 20rem;"
                    class="mb-2"
                  >
                    <b-badge slot="header" pill variant="primary">x{{furniture[1]}}</b-badge>
                  </b-card>
                </b-card-group>
                <b-button
                  :disabled="isBusy"
                  variant="success"
                  @click="handleBuy(room[0])"
                >Buy this room</b-button>
              </b-card-body>
            </b-collapse>
          </b-card>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import api from "../api/api";
import { mapGetters } from "vuex";
import { USER_REQUEST } from "../store/actions/user";
export default {
  name: "Rooms",
  data() {
    return {
      isBusy: false,
      rooms: []
    };
  },
  mounted() {
    this.isBusy = true;
    // api.defaults.headers["Authorization"] =
    //   "bearer " + this.$store.state.auth.token;
    if (this.isAuthenticated) this.handleUserRequest();
    this.getRooms().then(res => {
      this.rooms = res;
      this.isBusy = false;
    });
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"])
  },
  methods: {
    handleUserRequest() {
      this.$store.dispatch(USER_REQUEST);
    },
    getRooms() {
      return new Promise((resolve, reject) => {
        api
          .get("/room/getavailiable")
          .then(res => {
            const { data } = res;
            const grouped = Array.from(this.groupBy(data, room => room.IdRoom));
            const result = grouped.map((val, index) => {
              console.log(index);
              return [val[0], this.unique(val[1])];
            });
            resolve(result);
            console.log("res: ", this.rooms);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    handleBuy(id) {
      this.isBusy = true;
      const { IdUser } = this.getProfile;
      api
        .post(`/user/${IdUser}/rooms/${id}`)
        .then(res => {
          if (res.status != 200) {
            alert(res.data.err);
          }
          return this.getRooms();
        })
        .then(data => {
          this.rooms = data;
          this.isBusy = false;
        });
    },
    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach(item => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
    unique(arr) {
      let obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i].IdFurniture;
        obj[str] = obj[str] ? [arr[i], obj[str][1] + 1] : [arr[i], 1]; 
      }

      return obj; 
    }
  }
};
</script>

<style scoped>
</style>
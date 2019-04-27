<i18n>
{
  "en": {
    "Buy rooms": "Buy rooms"
  },
  "ua": {
    "Controll my rooms": "Керування моїми кімнатами",
    "You have not buy any room": "Ви не купили жодної кімнати",
    "Room number:":"Кімната номер:",
    "Get Started": "Розпочати",
    "You have not buy any room":"Ви не купили жодної кімнати",
    "Delete this room":"Видалити цю кімнату",
    "Height:":"Висота"
  }
}
</i18n>



<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="8">
        <h1 class="my-4">{{$t('Controll my rooms')}}</h1>
        <b-card v-if="rooms.length == 0">
          <p class="card-text text-center">{{$t('You have not buy any room')}}</p>
        </b-card>
        <template v-for="room in rooms">
          <b-card class="mb-1" :key="room[0]">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn
                block
                href="#"
                v-b-toggle="'collapse'+room[0]"
                variant="info"
              >{{$t('Room number:')}} {{room[1][0].num}}</b-btn>
            </b-card-header>
            <b-collapse :id="'collapse'+room[0]" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-group deck>
                  <b-card
                    v-for="(furniture,index) in room[1]"
                    :key="index"
                    :title="furniture.name"
                    :img-src="furniture.src"
                    img-alt="Image"
                    img-top
                    tag="article"
                    style="max-width: 20rem;"
                    class="mb-2"
                  >
                    <b-form-checkbox
                      :disabled="isBusy"
                      :id="'checkbox'+ room[0]*10 + index"
                      v-model="roomUnlock[room[0]*10 + index].unlock"
                      value="unlock"
                      unchecked-value="lock"
                    >{{roomUnlock[room[0]*10 + index].unlock}}</b-form-checkbox>
                    <label
                      for="'range'+ room[0] + index"
                    >{{$t('Height:')}} {{roomUnlock[room[0]*10 + index].height}}</label>
                    <b-form-input
                    @input="setHeightEvent(roomUnlock[room[0]*10 + index].unlock)"
                      :disabled="isBusy"
                      type="range"
                      :id="'range'+ room[0]*10 + index"
                      v-model="roomUnlock[room[0]*10 + index].height"
                      min="0"
                      max="200"
                    />
                    <b-button
                      variant="success"
                      :disabled="isBusy"
                      @click="handleSetStateClick(room[0]*10 + index, furniture.id)"
                    >{{$t('Save State')}}</b-button>
                  </b-card>
                  <b-button
                    class="mx-auto my-auto"
                    variant="danger"
                    :disabled="isBusy"
                    @click="handleDelete(room[0])"
                  >{{$t('Delete this room')}}</b-button>
                </b-card-group>
              </b-card-body>
            </b-collapse>
          </b-card>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import socketIO from 'socket.io-client'
import api from "../api/api";
import { mapGetters } from "vuex";
import { USER_REQUEST } from "../store/actions/user";
import Vue from "vue";
export default {
  name: "Controll",
  data() {
    return {
      socket: io('http://localhost:3000/clients'),
      isBusy: false,
      roomUnlock: [],
      rooms: []
    };
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated"])
  },
  mounted() {
    console.log(this.$i118n);
    if (this.isAuthenticated) {
      this.handleUserRequest()
        .then(res => {
          this.loadRooms();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    setHeightEvent(string){
      console.log(string);
      console.log("CLIENT WORK");
    this.socket.emit('set_height', {value: 10, unlock:(string == 'unlock')?1:0})
    },
    handleDelete(IdRoom) {
      const { IdUser } = this.getProfile;
      this.isBusy = true;
      api
        .delete(`/user/rooms`, { data: { IdRoom: IdRoom } })
        .then(data => {
          this.loadRooms();
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadRooms() {
      this.getRooms().then(res => {
        if (res.data.length > 0) {
          const grouped = Array.from(
            this.groupBy(res.data, room => room.IdRoom)
          );
          this.rooms = grouped;
          this.rooms.forEach(value => {
            value[1].forEach((val, key) => {
              Vue.set(this.roomUnlock, value[0] * 10 + key, {
                height: val.height,
                unlock: val.unlock ? "unlock" : "lock"
              });
            });
          });
          this.isBusy = false;
        } else {
          this.rooms = [];
          this.roomUnlock = [];
        }
      });
    },

    handleSetStateClick(idx, id) {
      const el = this.roomUnlock[idx];
      const { height, unlock } = el;
      const numUnlock = unlock == "unlock" ? 1 : 0;
      this.isBusy = true;
      api
        .put("room/setstate", { height, unlock: numUnlock, id })
        .then(data => {
          this.loadRooms();
        })
        .catch(err => {
          console.log(err);
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
    handleUserRequest() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch(USER_REQUEST)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getRooms() {
      return new Promise((resolve, reject) => {
        api
          .get(`user/rooms`)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>

<style scoped>
</style>
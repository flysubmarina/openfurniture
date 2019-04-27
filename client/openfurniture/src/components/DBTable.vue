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
  <div>
    <b-modal
      v-model="showAddForm"
      id="addForm"
      ref="modal"
      :title="'Add new ' + name"
      @ok="handleAdd"
      @shown="clearAddFields"
    >
      <form @submit.stop.prevent="handleSubmitAddForm">
        <template v-for="input in addRequest.body">
          <b-form-group
            v-if="input.type == 'text'"
            :key="input.name"
            horizontal
            :label-cols="2"
            label-size="lg"
            :label="input.name"
            :label-for="input.name"
          >
            <b-form-input id="input.name" type="text" v-model="addValues[input.name].value"></b-form-input>
          </b-form-group>
          <b-form-group
            :key="input.name"
            v-else-if="input.type =='combobox'"
            horizontal
            :label-cols="3"
            label-size="lg"
            :label="input.name"
            :label-for="input.name"
          >
            <b-dropdown :id="input.name" :text="addValues[input.name].text" class="m-md-2">
              <b-dropdown-item
                @click="handleDropClick(item, input.name)"
                v-for="item in addValues[input.name].values"
                :key="item[input.name]"
              >{{item.text}}</b-dropdown-item>
            </b-dropdown>
          </b-form-group>
        </template>
      </form>
    </b-modal>
    <b-modal
      v-model="showEditForm"
      id="editForm"
      ref="editModal"
      :title="'Edit ' + name"
      @ok="handleEdit"
      @shown="clearAddFields"
    >
      <form @submit.stop.prevent="handleSubmitEditForm">
        <template v-for="input in addRequest.body">
          <b-form-group
            v-if="input.type == 'text'"
            :key="input.name"
            horizontal
            :label-cols="2"
            label-size="lg"
            :label="input.name"
            :label-for="input.name"
          >
            <b-form-input id="input.name" type="text" v-model="addValues[input.name].value"></b-form-input>
          </b-form-group>
          <b-form-group
            :key="input.name"
            v-else-if="input.type =='combobox'"
            horizontal
            :label-cols="3"
            label-size="lg"
            :label="input.name"
            :label-for="input.name"
          >
            <b-dropdown :id="input.name" :text="addValues[input.name].text" class="m-md-2">
              <b-dropdown-item
                @click="handleDropClick(item, input.name)"
                v-for="item in addValues[input.name].values"
                :key="item[input.name]"
              >{{item.text}}</b-dropdown-item>
            </b-dropdown>
          </b-form-group>
        </template>
      </form>
    </b-modal>
    <b-button v-if="addRequest.url.length > 0" class="my-3" variant="success" @click="showAddModal" :disabled="isBusy">Add {{name}}</b-button>
    <b-table ref="table" :busy="isBusy" :fields="fields" striped hover :items="provider">
      <template slot="Actions" slot-scope="row">
        <b-button-group>
          <b-button
            v-if="deleteRequest"
            :disabled="isBusy"
            variant="danger"
            @click="handleDelete(row.item)"
          >Delete</b-button>
          <b-button
            v-if="updateRequest"
            :disabled="isBusy"
            variant="warning"
            @click="handleEditClick(row.item)"
          >Edit</b-button>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script>
import api from "../api/api";
export default {
  name: "DBTable",
  props: {
    name: {
      type: String,
      default: "Table"
    },
    request: {
      type: Object,
      default: () => {
        return {
          url: ""
        };
      }
    },
    addRequest: {
      type: Object,
      default: () => {
        return {
          url: "",
          body: [] /* {type: 'text' || 'checkbox' || 'combobox', name: '', 
          innerRequest: {url:'', textField:'', bindField:''} (if combobox)
          checkedValue:'',
          uncheckedValue:''
          }*/
        };
      }
    },
    deleteRequest: {
      type: Object,
      default: () => {
        return {
          url: "",
          body: null
        };
      }
    },
    updateRequest: {
      type: Object,
      default: () => {
        return {
          url: "",
          body: null
        };
      }
    },
    byIdComboBox: {
      type: Object,
      default: () => null
      // {text: 'text_field', bind: 'id'}
    },
    fields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      addValues: new Object(),
      updateId: new Object(),
      addRequestObj: null,
      isBusy: false,
      showAddForm: false,
      showEditForm: false
    };
  },
  created() {
    this.addRequest.body.forEach(el => {
      const { name } = el;
      console.log(name);
      if (el.type == "text") {
        // this.addValues[name] = {value: ''}
        this.$set(this.addValues, name, { value: "" });
      } else if (el.type == "combobox") {
        const { url } = el.innerRequest;
        const { bindField: bind, textField: text } = el.innerRequest;
        this.$set(this.addValues, name, { values: [], bind: "", text: "" });
        api.get(url).then(data => {
          const values = data.data.map((val, index, arr) => {
            let obj = {};
            obj.bind = val[bind];
            obj.text = val[text];
            return obj;
          });
          console.log(values);
          this.$set(this.addValues, name, {
            values,
            bind: "",
            text: "Select " + name
          });
        });
      }
    });
  },
  methods: {
    handleEditClick(item) {
      const { body: fields } = this.updateRequest;
      console.log(fields);
      fields.forEach(element => {
        if (item[element]) {
          this.updateId[element] = item[element];
        }
      });
      this.showEditForm = true;
    },
    provider(ctx) {
      let promise = api.get(this.request.url);
      console.log("working provider");
      // Must return a promise that resolves to an array of items
      return promise.then(data => {
        console.log(data);
        // Pluck the array of items off our axios response
        let items = data.data;
        // Must return an array of items or an empty array if an error occurred
        return items || [];
      });
    },
    handleEdit(evt) {
      let empty = false;
      for (const key in this.addValues) {
        if (this.addValues.hasOwnProperty(key)) {
          const element = this.addValues[key];
          if (!element.value && !element.bind) empty = true;
        }
      }
      if (empty) {
        alert("Empty fields");
      } else {
        const postObject = {};
        for (const key in this.addValues) {
          if (this.addValues.hasOwnProperty(key)) {
            const element = this.addValues[key];
            if (element.value) {
              postObject[key] = element.value;
            } else if (element.bind) {
              const found = this.addRequest.body.find(x => x.name == key);
              if (found) {
                const bindKey = found.innerRequest.bindField;
                postObject[bindKey] = element.bind;
              } else postObject[key] = element.bind;
            }
          }
        }
        this.handleEditSubmit(postObject);
      }
    },
    handleAdd(evt) {
      evt.preventDefault();
      let empty = false;
      for (const key in this.addValues) {
        if (this.addValues.hasOwnProperty(key)) {
          const element = this.addValues[key];
          if (!element.value && !element.bind) empty = true;
        }
      }
      if (empty) {
        alert("Empty fields");
      } else {
        const postObject = {};
        for (const key in this.addValues) {
          if (this.addValues.hasOwnProperty(key)) {
            const element = this.addValues[key];
            if (element.value) {
              postObject[key] = element.value;
            } else if (element.bind) {
              const found = this.addRequest.body.find(x => x.name == key);
              if (found) {
                const bindKey = found.innerRequest.bindField;
                postObject[bindKey] = element.bind;
              } else postObject[key] = element.bind;
            }
          }
        }
        this.handleAddSubmit(postObject);
      }
    },
    handleAddSubmit(postObject) {
      const { url } = this.addRequest;
      api.post(url, postObject).then(res => {
        this.isBusy = true;
        this.$refs.table.refresh();
        // this.clearAddFields();
        this.showAddForm = false;
        this.isBusy = false;
      });
    },
    handleEditSubmit(postObject) {
      const { url } = this.updateRequest;
      const finalPostObject = {...postObject, ...this.updateId}
      console.log(finalPostObject);
      api.put(url, finalPostObject).then(res => {
        this.isBusy = true;
        this.$refs.table.refresh();
        // this.clearAddFields();
        this.showAddForm = false;
        this.isBusy = false;
      });

    },
    clearAddFields() {
      for (const key in this.addValues) {
        console.log(key);
        if (this.addValues.hasOwnProperty(key)) {
          const element = this.addValues[key];
          if (element.value) element.value = "";
          if (element.bind) {
            element.bind = 0;
            element.text = "Select " + key;
          }
        }
      }
    },
    showAddModal() {
      this.showAddForm = true;
    },
    handleDropClick(item, id) {
      this.addValues[id].bind = item.bind;
      this.addValues[id].text = item.text;
      console.log({ item, id });
    },
    handleDelete(item) {
      const { body: fields } = this.deleteRequest;
      console.log(fields);
      const deleteBody = {};
      fields.forEach(element => {
        if (item[element]) {
          deleteBody[element] = item[element];
        }
      });
      console.log(deleteBody);
      api
        .delete(this.deleteRequest.url, { data: deleteBody })
        .then(res => {
          this.isBusy = true;
          this.$refs.table.refresh();
          this.isBusy = false;
        })
        .catch(err => {
          console.log("ERROR");
          this.isBusy = false;
        });
    }
  }
};
</script>

<style scoped>
</style>
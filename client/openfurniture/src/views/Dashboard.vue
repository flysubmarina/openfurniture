<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col class="my-4 mx-auto" cols="8">
        <h1>Admin dashboard</h1>
        <DBTable
          :update-request="roomTable.updateRequest"
          :add-request="roomTable.addRequest"
          :name="'Room'"
          :delete-request="roomTable.deleteRequest"
          :fields="roomTable.fields"
          :request="roomTable.getRequest"
        />
        <hr>
        <DBTable
          :update-request="furnitureTable.updateRequest"
          :add-request="furnitureTable.addRequest"
          :name="'Furniture'"
          :delete-request="furnitureTable.deleteRequest"
          :fields="furnitureTable.fields"
          :request="furnitureTable.getRequest"
        />
        <hr>
        <DBTable
          :update-request="roomFurnitureTable.updateRequest"
          :add-request="roomFurnitureTable.addRequest"
          :name="'Room Furniture'"
          :delete-request="roomFurnitureTable.deleteRequest"
          :fields="roomFurnitureTable.fields"
          :request="roomFurnitureTable.getRequest"
        />
        <hr>
        <DBTable
          :update-request="userTable.updateRequest"
          :add-request="userTable.addRequest"
          :name="'User'"
          :delete-request="userTable.deleteRequest"
          :fields="userTable.fields"
          :request="userTable.getRequest"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DBTable from "../components/DBTable.vue";
export default {
  name: "Dashboard",
  data() {
    return {
      roomTable: {
        fields: ["IdRoom", "num", "Actions"],
        getRequest: {
          url: "/room"
        },
        updateRequest: {
          url: "/room",
          body: ["IdRoom"]
        },
        deleteRequest: {
          url: "/room",
          body: ["IdRoom"]
        },
        addRequest: {
          url: "/room",
          body: [
            {
              type: "text",
              name: "num"
            }
          ]
        }
      },
      roomFurnitureTable: {
        fields: ["IdRoom", "num", "Actions"],
        getRequest: {
          url: "/room/furniture"
        },
        updateRequest: {
          url: "/room/furniture",
          body: ["IdRoom", "IdFurniture"]
        },
        deleteRequest: {
          url: "/room/furniture",
          body: ["id"]
        },
        addRequest: {
          url: "/room/furniture",
          body: [
            {
              type: "combobox",
              name: "Furniture",
              innerRequest: {
                url: "/furniture",
                bindField: "IdFurniture",
                textField: "name"
              }
            },
            {
              type: "combobox",
              name: "Room num",
              innerRequest: {
                url: "/room",
                bindField: "IdRoom",
                textField: "num"
              }
            }
          ]
        }
      },
      furnitureTable: {
        fields: ["IdFurniture", "name", "type", "src", "Actions"],
        getRequest: {
          url: "/furniture"
        },
        updateRequest: {
          url: "/furniture",
          body: ["IdFurniture"]
        },
        deleteRequest: {
          url: "/furniture",
          body: ["IdFurniture"]
        },
        addRequest: {
          url: "/furniture",
          body: [
            {
              type: "text",
              name: "name"
            },
            {
              type: "text",
              name: "type"
            },
            {
              type: "text",
              name: "src"
            }
          ]
        }
      },
      userTable: {
        fields: ["IdUser", "login", "type", "Actions"],
        getRequest: {
          url: "/user/getall"
        },
        updateRequest: {
          url: "/user/account",
          body: ["IdUser"]
        },
        deleteRequest: {
          url: "/user/account",
          body: ["IdUser"]
        },
        addRequest: {
          url: "/user/register",
          body: [
            {
              type: "text",
              name: "login"
            },
            {
              type: "text",
              name: "type"
            },
            {
              type: "text",
              name: "password"
            },
            {
              type: "text",
              name: "confirmPassword"
            }
          ]
        }
      }
    };
  },
  components: {
    DBTable
  }
};
</script>

<style scoped>
</style>
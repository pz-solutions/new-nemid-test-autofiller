<template>
  <el-form :model="dynamicValidateForm" label-width="120px" class="demo-dynamic">
    <el-table
      ref="singleTable"
      :data="cprs"
      style="width: 100%">
      <el-table-column
        property="selected"
        width="30">
        <template slot-scope="scope">
          <el-checkbox v-if="scope.row" @input="select(scope.row.id)" :value="isSelected(scope.row.id)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="Name"
        width="140">
        <template slot-scope="scope">
          <el-input v-if="scope.row" v-model="scope.row.name" placeholder="Name"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        property="password"
        label="Password"
        width="140">
        <template slot-scope="scope">
          <el-input v-if="scope.row" v-model="scope.row.password" placeholder="Password"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        width="60">
        <template slot-scope="scope">
          <el-button v-if="scope.row" type="danger" icon="el-icon-minus" @click="removeUser(scope.row)" circle></el-button>
          <el-button v-if="!scope.row" type="success" icon="el-icon-plus" @click="addUser" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="center">
      <el-col>
        <el-button type="primary" @click="submitForm">Save</el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
const enabledIcon128 = "/icons/icon-128.png";
const enabledIcon48 = "/icons/icon-48.png";
const enabledIcon32 = "/icons/icon-32.png";
const enabledIcon16 = "/icons/icon-16.png";
const disabledIcon128 = "/icons/icon-128-disabled.png";
const disabledIcon48 = "/icons/icon-48-disabled.png";
const disabledIcon32 = "/icons/icon-32-disabled.png";
const disabledIcon16 = "/icons/icon-16-disabled.png";
export default {
  data: () => ({
    cprs: null,
    selected: null
  }),
  mounted() {
    chrome.storage.local.get(["ntaf", "cprs"], (items) => {
      const ntaf = items["ntaf"];
      const cprs = items["cprs"];
      this.cprs = cprs || [{ id: 0, name: "", password: "" }, null];
      this.selected = ntaf && ntaf.id;
      this.setIcon(ntaf);
    });
  },
  methods: {
    setIcon(enabled, callback) {
      if (enabled) {
        chrome.browserAction.setIcon(
          {
            path: {
              "128": enabledIcon128,
              "48": enabledIcon48,
              "32": enabledIcon32,
              "16": enabledIcon16
            }
          },
          callback
        );
      } else {
        chrome.browserAction.setIcon(
          {
            path: {
              "128": disabledIcon128,
              "48": disabledIcon48,
              "32": disabledIcon32,
              "16": disabledIcon16
            }
          },
          callback
        );
      }
    },
    select(id) {
      if (this.selected === id) {
        this.selected = null;
      } else {
        this.selected = id;
      }
    },
    isSelected(id) {
      return this.selected === id;
    },
    submitForm() {
      const item = this.cprs.filter(o => o && o.id === this.selected)[0];
      chrome.storage.local.set(
        {
          ntaf: item || null,
          cprs: this.cprs
        },
        () => {
          this.setIcon(item, () => {
            window.close();
          });
        }
      );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeUser(item) {
      var index = this.cprs.indexOf(item);
      if (index !== -1) {
        this.cprs.splice(index, 1);
      }
    },
    addUser() {
      const next =
        this.cprs.length === 1
          ? 0
          : Math.max(...this.cprs.filter(o => o).map(o => o.id)) + 1;
      this.cprs.splice(this.cprs.length - 1, 0, {
        id: next,
        name: "",
        password: ""
      });
    }
  }
};
</script>


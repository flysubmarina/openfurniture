<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="warning"
      @dismissed="handleDissmiss"
      @dismiss-count-down="countDownChanged"
    >{{msg}}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: "Error"
    }
  },
  data() {
    return {
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false
    };
  },
  methods: {
    handleDissmiss() {
      this.dismissCountDown = 0;
      thos.$emit('dissmissed')
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  }
};
</script>
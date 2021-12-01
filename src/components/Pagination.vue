<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="page !== 1" class="page-item" @click="previousPage">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#">{{ page }}</a>
      </li>
      <li v-if="!isLast" class="page-item" @click="nextPage">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ["isLast", "page"],
  data() {
    return {
      pageAction: "",
    };
  },
  methods: {
    previousPage() {
      this.pageAction = "previous";
      this.$emit("changePage", this.pageAction);
    },
    nextPage() {
      this.pageAction = "next";
      this.$emit("changePage", this.pageAction);
    },
    // previousPage() {
    //   if (this.page === 1) {
    //     return;
    //   } else {
    //     this.page--;
    //     this.$emit("changePage", this.page);
    //   }
    // },
    // nextPage() {
    //   this.page++;
    //   this.$emit("changePage", this.page);
    // },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/base/bootstrap.scss";
</style>

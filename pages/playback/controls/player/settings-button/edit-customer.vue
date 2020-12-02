<template>
  <div>
    <EditCustomer :dialogdata="customer" :dataindex="0"> </EditCustomer>
  </div>
</template>

<script>
import { EditCustomer } from "@/dist/mantarray.common";
// import EditCustomer from "@/components/playback/controls/player/EditCustomer.vue";
export default {
  components: {
    EditCustomer,
  },
  data() {
    return {
      customer: {
        cust_id: 0,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        api_key: "06ad547f-fe02-477b-9473-f7977e4d5e17",
        nickname: "Experiment anemia -1",
        user_ids: [],
      },
    };
  },
};
</script>

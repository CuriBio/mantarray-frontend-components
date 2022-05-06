<template>
  <div>
    <EditUser :dialogdata="customer"> </EditUser>
  </div>
</template>

<script>
import { EditUser } from "@/dist/mantarray.common";
// import EditUser from "@/components/settings/EditUser.vue";
export default {
  components: {
    EditUser,
  },
  data() {
    return {
      customer: {
        customer_id: 0,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        user_password: "06ad547f-fe02-477b-9473-f7977e4d5e17",
        user_name: "Experiment anemia -1",
      },
    };
  },
};
</script>

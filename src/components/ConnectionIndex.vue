<template>
  <div>
    <ul
      class="flex flex-wrap text-sm font-medium text-center border-b border-gray-200"
    >
      <li class="me-2">
        <a
          v-for="status in statuses"
          :key="status"
          href="#"
          aria-current="page"
          class="inline-block p-4 rounded-t-lg"
          :class="
            activeTab == status
              ? 'text-blue-600 bg-gray-100 active'
              : 'hover:text-gray-600 hover:bg-gray-50'
          "
          @click="activeTab = status"
          >{{ status }}</a
        >
      </li>
    </ul>
    <!--tab displays -->
    <div>
      <template v-if="userTypes[activeTab.toLowerCase()].length">
        <ul v-for="user in userTypes[activeTab.toLowerCase()]" :key="user.id">
          <li>
            {{ user.name }} {{ user.id }} <button>{{ activeTab }}</button>
          </li>
        </ul>
      </template>
      <template v-else>
        <p>No users found</p>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import UserService from "@/js/services/user.js";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const statuses = [
      "Connect", //all available users
      "Requesting", //users that I requested to connect
      "Requests", //users that requested to connect me
      "Follower", //users that follow me
      "Following", //users that I follow
    ];
    const activeTab = ref(statuses[0]);
    // const users = ref([]);
    const userDetails = computed(() => store.getters?.getCurrentUserDetails);

    const userTypes = reactive({
      connect: [],
      requesting: [],
      requests: [],
      follower: [],
      following: [],
    });

    onMounted(() => {
      UserService.getConnects(userDetails.value.id).then((response) => {
        const { connect, requesting, requests, follower, following } =
          response.data;
        userTypes.connect = connect;
        userTypes.requesting = requesting;
        userTypes.requests = requests;
        userTypes.follower = follower;
        userTypes.following = following;
      });
    });

    return {
      activeTab,
      statuses,
      // users,
      userTypes,
    };
  },
};
</script>

<style></style>

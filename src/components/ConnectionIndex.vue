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
      <template v-if="userTypes[activeTab].length">
        <div
          v-for="user in userTypes[activeTab]"
          :key="user.id"
          class="p-4 pb-0"
        >
          <div class="w-full">
            <div
              class="border border-gray-100 bg-white rounded p-4 flex flex-col justify-between leading-normal"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    class="w-10 h-10 rounded-full mr-4"
                    src="../assets/images/logo.png"
                    :alt="user.name"
                  />
                  <div class="text-sm">
                    <p class="text-gray-900 leading-none">{{ user.name }}</p>
                    <p class="text-gray-600">{{ user.created_at }}</p>
                  </div>
                </div>
                <button @click="changeStatus(activeTab, user.id)">
                  {{ getDisplayWord(activeTab) }}
                </button>
              </div>
            </div>
          </div>
        </div>
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
      "connect", //all available users
      "requesting", //users that I requested to connect
      "requests", //users that requested to connect me
      "follower", //users that follow me
      "following", //users that I follow
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

    const getDisplayWord = (status) => {
      switch (status) {
        case "connect":
          return "Connect";
        case "requesting":
          return "Cancel Request";
        case "requests":
          return "Accept";
        case "follower":
          return "Follow Back";
        case "following":
          return "Unfollow";
        default:
          return "Connect";
      }
    };

    const changeStatus = (activeTab, targetUserId) => {
      // to check current logic first below enabling more functions
      if (activeTab == "follower" || activeTab == "following") return;
      const oldStatusIndex = statuses.indexOf(activeTab);
      const newStatus = statuses[oldStatusIndex + 1];
      console.log({
        userId: userDetails.value?.id,
        targetUserId,
        newStatus: newStatus,
        oldStatus: activeTab,
      });
      UserService.updateConnects({
        userId: userDetails.value.id,
        targetUserId,
        newStatus,
        oldStatus: activeTab,
      }).then((response) => {
        console.log(response);
      });
    };

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
      changeStatus,
      userTypes,
      getDisplayWord,
    };
  },
};
</script>

<style scoped>
a[href] {
  text-transform: capitalize;
}
</style>

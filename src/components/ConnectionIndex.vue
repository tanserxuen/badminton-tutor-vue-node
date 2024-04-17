<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Connection Index</h2>
    <div class="base-page__inner-margin">
      <form class="max-w-md mx-auto">
        <div class="flex">
          <label
            for="location-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only"
            >Search</label
          >
          <div class="relative w-full">
            <input
              type="search"
              id="location-search"
              class="block p-2.5 mb-3 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-lg"
              placeholder="Search anyone..."
              required
            />
            <button
              type="submit"
              class="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white hover:bg-gray-100"
              style="background-color: rgb(255, 242, 224)"
            >
              <i class="fas fa-search text-gray-500"></i>
              <span class="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>

      <div
        class="flex flex-wrap text-sm font-medium text-center border-b border-gray-200"
      >
        <div class="me-2">
          <a
            v-for="status in statuses"
            :key="status"
            href="#"
            aria-current="page"
            class="inline-block p-4 rounded-t-lg"
            :class="
              activeTab == status
                ? 'text-amber-600 bg-amber-100 active'
                : 'hover:text-amber-600 hover:bg-orange-50'
            "
            @click="activeTab = status"
            >{{ status }}</a
          >
        </div>
      </div>
      <!--tab displays -->
      <div>
        <template v-if="userTypes[activeTab].length">
          <div v-for="user in userTypes[activeTab]" :key="user.id" class="pt-4">
            <div class="w-full">
              <div
                class="border border-gray-100 bg-white rounded-lg p-4 flex flex-col justify-between leading-normal hover:bg-amber-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img
                      class="w-10 h-10 rounded-full mr-4"
                      :src="
                        user.image == ''
                          ? '/images/placeholderImg.jpg'
                          : user.image
                      "
                      :alt="user.name"
                    />
                    <div class="text-sm">
                      <p
                        class="text-gray-900 leading-none text-base font-semibold mb-1"
                      >
                        {{ user.name }}
                      </p>
                      <p class="text-gray-600 text-xs">
                        {{ date(user.created_at) }}
                      </p>
                    </div>
                  </div>
                  <button
                    class="primary-button"
                    @click="changeStatus(activeTab, user.id)"
                  >
                    {{ getDisplayWord(activeTab) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="pt-4">No users found</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import UserService from "@/js/services/user.js";
import { useStore } from "vuex";
import getDateFromTimestamp from "@/js/services/date.js";

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

    const date = computed(() => {
      return (timestamp) => {
        return getDateFromTimestamp(timestamp);
      };
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
      date,
    };
  },
};
</script>

<style scoped>
a[href] {
  text-transform: capitalize;
}

img {
  object-fit: cover;
  object-position: center;
}

input[type="search"] {
  /* background-color: rgb(255, 242, 224); */
  border: 0;
}
</style>

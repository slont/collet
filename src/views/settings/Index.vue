<template>
  <div id="settings-index">
    <aside class="settings-menu menu">
      <p class="menu-label">
        アカウント
      </p>
      <ul class="menu-list">
        <router-link to="/settings/profile" tag="li"><a>プロフィール</a></router-link>
      </ul>
    </aside>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss">
  #settings-index {
    display: flex;
    padding: 1.5rem;

    .settings-menu {
      width: 300px;
      margin-right: 1rem;

      .menu-list {
        .router-link-active a {
          @extend .is-active;
        }
      }
    }
  }
</style>

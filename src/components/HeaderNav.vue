<template>
  <nav id="header-nav" class="navbar is-info">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </a>

      <a class="navbar-item is-hidden-desktop" href="https://github.com/jgthms/bulma" target="_blank">
      <span class="icon" style="color: #333;">
        <i class="fa fa-lg fa-github"></i>
      </span>
      </a>

      <a class="navbar-item is-hidden-desktop" href="https://twitter.com/jgthms" target="_blank">
      <span class="icon" style="color: #55acee;">
        <i class="fa fa-lg fa-twitter"></i>
      </span>
      </a>

      <div class="navbar-burger burger" :class="{ 'is-active': activeNavbarMenu }"
           @click="activeNavbarMenu = !activeNavbarMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': activeNavbarMenu }">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link  is-active" href="/documentation/overview/start/">
            Docs
          </a>
          <div class="navbar-dropdown is-boxed">
            <a class="navbar-item " href="/documentation/overview/start/">
              Overview
            </a>
            <a class="navbar-item " href="https://bulma.io/documentation/modifiers/syntax/">
              Modifiers
            </a>
            <a class="navbar-item " href="https://bulma.io/documentation/columns/basics/">
              Columns
            </a>
            <a class="navbar-item " href="https://bulma.io/documentation/layout/container/">
              Layout
            </a>
            <a class="navbar-item " href="https://bulma.io/documentation/form/general/">
              Form
            </a>
            <a class="navbar-item " href="https://bulma.io/documentation/elements/box/">
              Elements
            </a>

            <a class="navbar-item is-active" href="https://bulma.io/documentation/components/breadcrumb/">
              Components
            </a>

            <hr class="navbar-divider">
            <div class="navbar-item">
              <div>
                <p class="is-size-6-desktop">
                  <strong>0.6.0</strong>
                </p>

                <small>
                  <a class="bd-view-all-versions" href="https://versions.bulma.io/">View all versions</a>
                </small>

              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="https://bulma.io/blog/">
            Blog
          </a>
          <div id="blogDropdown" class="navbar-dropdown is-boxed" data-style="width: 18rem;">

            <a class="navbar-item" href="/2017/10/09/roses-are-red-links-are-blue/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-link">09 Oct 2017</small>
                </p>
                <p>Roses are red – Links are blue</p>
              </div>
            </a>

            <a class="navbar-item" href="/2017/08/03/list-of-tags/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-link">03 Aug 2017</small>
                </p>
                <p>New feature: list of tags</p>
              </div>
            </a>

            <a class="navbar-item" href="/2017/08/01/bulma-bootstrap-comparison/">
              <div class="navbar-content">
                <p>
                  <small class="has-text-link">01 Aug 2017</small>
                </p>
                <p>Bulma / Bootstrap comparison</p>
              </div>
            </a>

            <a class="navbar-item" href="https://bulma.io/blog/">
              More posts
            </a>
            <hr class="navbar-divider">
            <div class="navbar-item">
              <div class="navbar-content">
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <strong>Stay up to date!</strong>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <a class="button bd-is-rss is-small" href="https://bulma.io/atom.xml">
                      <span class="icon is-small">
                        <i class="fa fa-rss"></i>
                      </span>
                        <span>Subscribe</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">
            More
          </div>
          <div id="moreDropdown" class="navbar-dropdown is-boxed">
            <a class="navbar-item " href="https://bulma.io/bulma-start/">
              <p>
                <strong>Bulma start</strong>
                <br>
                <small>A tiny npm package to get started</small>
              </p>
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item " href="https://bulma.io/made-with-bulma/">
              <p>
                <strong>Made with Bulma</strong>
                <br>
                <small>The official community badge</small>
              </p>
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item " href="https://bulma.io/extensions/">
              <p>
                <strong>Extensions</strong>
                <br>
                <small>Side projects to enhance Bulma</small>
              </p>
            </a>
          </div>
        </div>
        <a class="navbar-item " href="https://bulma.io/expo/">
          <span class="bd-emoji">⭐️</span>
          Expo
        </a>
        <a class="navbar-item " href="https://bulma.io/love/">
          <span class="bd-emoji">❤️</span>
          Love
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item" v-if="!$store.state.loggedIn">
          <div class="field is-grouped">
            <p class="control">
              <nav class="breadcrumb">
                <ul>
                  <li><router-link to="/signin">ログイン</router-link></li>
                  <li><router-link to="/signup">新規登録</router-link></li>
                </ul>
              </nav>
            </p>
          </div>
        </div>
        <div class="navbar-item" v-if="!$store.state.loggedIn">
          <div class="field is-grouped">
            <p class="control">
              <nav class="breadcrumb">
                <ul>
                  <li><router-link to="/signin">ログイン</router-link></li>
                  <li><router-link to="/signup">新規登録</router-link></li>
                </ul>
              </nav>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      activeNavbarMenu: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  #header-nav {
    .navbar-end {
      .breadcrumb {
        $color: white;
        a {
          color: $color;

          &:hover {
            color: darken($color, 15%);
          }
        }
      }
    }
  }
</style>

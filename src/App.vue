<template>
  <!-- 네비게이션 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <!-- a태그 : vue는 처음에 src 밑의 모든 파일을 하나의 파일로 만들어서 미리 가져오는데,
  a태그를 사용할 경우, 다시 받아오기 때문에 페이지 전환 시 로딩이 발생한다.(로고가 돈다.)
  <a class="navbar-brand" href="/">vue3-project</a>
  -->
  <router-link class="navbar-brand" :to="{ name: 'Home' }">
    vue3-project
  </router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" :to="{ name: 'Todos' }">
          Todos
        </router-link>
      </li>
      <li class="nav-item active">
        <a class="nav-link" href="/todos">
          a태그:Todos
        </a>
      </li>
    </ul>
  </nav>
  <!-- 라우터 뷰 -->
  <router-view/>
</template>

<script>
export default {

}
</script>

<style>

</style>
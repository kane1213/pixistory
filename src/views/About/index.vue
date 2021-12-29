<template>
  <div>
    <h1>ABOUT PAGE</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {

    const mySocket = new WebSocket("ws://localhost:3002");
    // mySocket.onmessage = function(e) {
    //   console.log(e.data);
    //   alert('gogo')
    // }
    // mySocket.onmessage(() => {
    //   alert('cc')
    // })
    mySocket.addEventListener('open', function (event) {
      console.log('Open connection')
      mySocket.send(JSON.stringify({ data: 'Hello Server!' }));
    });
    mySocket.addEventListener('message', function (event) {
      console.log(`Message from server: ${event.data}`);
  });

    return {}
  }
})
</script>

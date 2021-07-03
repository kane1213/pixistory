<template lang="pug">
.home HOME
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import { Observable, of, from, fromEvent, EMPTY, NEVER, throwError, interval, timer } from 'rxjs'
import { filter, take } from 'rxjs/operators'
export default defineComponent({
  setup () {
    // const observable = new Observable((observer) => {
    //   try {
    //     observer.next('test1233232332')
    //     observer.complete()
    //   } catch (err) {
    //     observer.error(err);
    //   }
    // })

    // const observable = of('Jerry', 'Anna');
    // const observable = from(['Jerry', 'Anna']);
    // const observable = from(new Promise((resolve, reject) => {
    //   setTimeout(() => {resolve('hello');}, 3000)
    // }))
    // const observable = fromEvent(document.body, 'click');
    // const observable = interval(1000);
      const observable = timer(1000, 2000);


    // observable.pipe(filter(v => v.clientX > 500)).subscribe(
      observable.pipe(take(3)).subscribe(
      value => {
        console.log(value);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('complete');
      }
    )


    return {}
  }
})

</script>

<style scoped lang="sass">

</style>

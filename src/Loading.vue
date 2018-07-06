<template>
  <div id="mainDiv">
    <div style="flex: 0 1 auto; align-self: auto">
      <!--eslint-disable-next-line-->
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 48 48"><defs><linearGradient x1="9.89" y1="5.26" x2="78.8" y2="83.42" gradientUnits="userSpaceOnUse" id="a"><stop offset="0" stop-opacity=".3"></stop><stop offset="1" stop-opacity="0"></stop></linearGradient></defs><g fill="none" fill-rule="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal"><path d="M2 24a22 22 0 1 1 44 0 22 22 0 0 1-44 0z" fill="#484848" fill-rule="nonzero"></path><path d="M26.46 42.74l1.77-2.67L24 35.84l-7.06-9.4h2.36l-2.36-2.36v-2.35h2.36l-2.36-2.35 4.7-7.06H24l-6.06-6.06c.6-.2 1.21-.38 1.83-.52l1.88 1.87L24 5.26l2.35 2.35 1.88-1.87c.62.14 1.23.32 1.83.52l15.86 15.86a22 22 0 0 1-16.8 23.28zM12.24 28.78L28.9 45.45a22.07 22.07 0 0 1-10.24-.1L10.9 37.6 9.9 33.49l4.7 4.7z" fill="url(#a)" fill-rule="nonzero"></path><path d="M26.46 42.74l9.3-13.96-2.35 9.41 4.7-4.7-1.02 4.1a18.77 18.77 0 0 1-10.63 5.15zM10.9 37.6L9.9 33.49l4.7 4.7-2.35-9.4 9.3 13.95c-4.1-.54-7.8-2.4-10.63-5.14zm6.03-11.17h14.12L24 35.84zm0-4.7h14.12v2.35H16.94zm9.41-9.41l4.7 7.06h-14.1l4.7-7.06zm-6.58-6.58l1.88 1.87L24 5.26l2.35 2.35 1.88-1.87c.62.14 1.23.32 1.83.52l-3.7 3.7h-4.71l-3.7-3.7c.59-.2 1.2-.38 1.82-.52z"></path><path d="M26.46 42.74l9.3-13.96-2.35 9.41 4.7-4.7-1.02 4.1a18.77 18.77 0 0 1-10.63 5.15zM10.9 37.6L9.9 33.49l4.7 4.7-2.35-9.4 9.3 13.95c-4.1-.54-7.8-2.4-10.63-5.14zm6.03-11.17h14.12L24 35.84zm0-4.7h14.12v2.35H16.94zm9.41-9.41l4.7 7.06h-14.1l4.7-7.06zm-6.58-6.58l1.88 1.87L24 5.26l2.35 2.35 1.88-1.87c.62.14 1.23.32 1.83.52l-3.7 3.7h-4.71l-3.7-3.7c.59-.2 1.2-.38 1.82-.52z" fill="#fff" fill-rule="evenodd"></path><path d="M2 24a22 22 0 1 1 44 0 22 22 0 0 1-44 0z"></path><path d="M2 2h44v22H2z"></path><path d="M2 24V2h44v22z"></path><path d="M2 24V2h44v22z"></path><path d="M2 24V2h44v22z"></path><path d="M2 24V2h44v22z"></path></g></svg>
    </div>
    <div class="title">PostScriptumMC</div>
    <div class="title version">{{ appVersion }}</div>
    <br>
    <div style="flex: 0 1 auto; align-self: auto">
      <div class="spinner">
        <div class="bounce1"/>
        <div class="bounce2"/>
        <div class="bounce3"/>
      </div>
    </div>
  </div>
</template>

<script>
import { version as pkgVersion } from "../package.json";

/**
 * This is a simple Loading page that is to be displayed until the actual content has been loaded.
 * See App.vue for more details.
 */
export default {
  name: "Loading",
  data() {
    return {
      appVersion: `v${pkgVersion}`,
    };
  },
};
</script>

<style scoped>
  .title {
    font-family: sans-serif;
    font-size: xx-large;
    color: white;
    text-align: center;
  }
  .title.version {
    color: #9E9E9E;
  }

  /*hide scrollbar*/
  body {
    overflow-y: hidden;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  #mainDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background-color: #212121
  }

  /*
  Spinner from https://github.com/tobiasahlin/SpinKit

  The MIT License (MIT)

  Copyright (c) 2015 Tobias Ahlin

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  .spinner {
    /*display: flex;*/
    margin: 0 auto 0;
    /*width: 70px;*/
    text-align: center;
  }

  .spinner > div {
    width: 24px;
    height: 24px;
    background-color: white;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    /*flex: 1 0 auto;*/
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    /*flex: 1 0 auto;*/
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0)
    }
    40% {
      -webkit-transform: scale(1.0)
    }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
</style>

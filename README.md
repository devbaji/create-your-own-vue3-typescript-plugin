# Create your own vue 3 plugin and publish into NPM

### First create a vue 3 project using vite

```sh
npm create vite@latest test-vite-ts -- --template vue-ts
```

### Install rollup dev dependencies

```sh
npm i -D rollup rollup-plugin-vue rollup-plugin-typescript2 rollup-plugin-peer-deps-external rollup-plugin-postcss rollup-plugin-terser rollup-plugin-delete
```

### Create a plugin
Create a plugin which creates a component `BlueInput.vue` which will simply shows a input with blue border, create a directory `src/plugin` and make a file `BlueInput.vue` with following code 

> ./src/plugin/BlueInput.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  label?: string
}>()
</script>

<template>
    <div v-if="props.label">{{ props.label }}</div>
    <input class="my-blue-input"/>
</template>

<style scoped>
.my-blue-input {
  border: 1px solid #00f;
  border-radius: 5px;
}
</style>
```

Now create `index.ts` with code for installing your plugin

> ./src/plugin/index.ts
```typescript
import { App } from 'vue'
import BlueInput from './BlueInput.vue'

export default {
  install(app: App) {
    app.component('BlueInput', BlueInput)
  }
}
```

### Test your plugin
Install your plugin in main.js

> ./src/main.ts
```typescript
import { createApp } from 'vue'
import App from './App.vue'
import plugin from './plugin'

const app = createApp(App)
app.use(plugin)

app.mount('#app')

```

Now in `App.vue` try your plugin and check if it is working as expected

> ./src/App.vue
```vue
<template>
  <blue-input label="My Blue Input"/>
</template>
```

Now test your plugin by running 
```sh
npm run dev
```

### Setup `rollup.config.js` file
Create a file at root with following code

> ./rollup.config.js
```js
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'

export default [
  {
    input: 'src/plugin/index.ts',
    output: [
      {
        format: 'esm',
        file: 'dist/index.mjs',
        plugins: [terser()]
      },
      {
        format: 'cjs',
        file: 'dist/index.js',
        plugins: [terser()]
      }
    ],
    plugins: [
      vue(),
      typescript({
        check: false,
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
            declaration: true,
            declarationMap: true,
          }
        }
      }),
      postcss(),
      peerDepsExternal(),
      del({ targets: 'dist/*' })
    ]
  }
]
```

Now in package.json change the build script to rollup build script

> `./package.json`
```json
...,
"scripts": {
    "build": "rollup -c"
},
...
```

> :grey_exclamation:
> Also make sure to move vue from dependencies to devDependencies since we only need vue for testing our plugin in local


Now run command
```sh
npm run build
```

Now you can see the compiled files inside `./dist` directory

> :bulb:
> To avoid creating a sub directory 'plugin' inside `./dist` directory, update your tsconfig.json file and change all occurance of `src/` to `src/plugin/`

### Make everything ready to publish your plugin to NPM
Before publishing, in package.json set **files** to `./dist` so that everything other than `./dist` directory is ignored while publishing, also set **main** and **module** to point the js and mjs files created in `./dist` directory

> `./package.json`
```json
  ...,
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "files": [
    "dist/*"
  ],
  ...
```
You can also add your version, description, author, licence, repo ... in your package.json

> :warning:
> Make sure package name mentioned in package.json is unique and remove the line `"private": true` if present

#### Publishing to NPM registry
Run the following command to login into your NPM account

```sh
npm login
```

Once you are logged in run this command to publish your plugin
```npm
npm publish --access=public
```
You can go to your NPM account in browser and checkout the new package you just created and try installing and using it in any other vue projects.

*:heart: HAPPY CODING :heart:*

# Plan - Chad youth efforts

## Push to prod
```
yarn build
git add dist && git commit -m "[EDIT] Deployement commit"
git subtree push --prefix dist origin dist
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

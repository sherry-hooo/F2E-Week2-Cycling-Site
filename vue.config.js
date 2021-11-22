module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/F2E-Week2-Cycling-Site/" : "/",
  css: {
    loaderOptions: {
      // pass options to sass-loader
      // @/ is an alias to src/
      // so this assumes you have a file named `src/variables.sass`
      // Note: this option is named as "prependData" in sass-loader v8

      // because `scss` syntax is also processed by sass-loader underlyingly
      // but when configuring the `prependData` option
      // `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
      // in that case, we can target the `scss` syntax separately using the `scss` option
      scss: {
        prependData: `@use "~@/assets/scss/abstract/_breakpoint.scss";`,
      },
    },
  },
};

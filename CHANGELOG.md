# Change Log

<a name="2.12.3"></a>
## [2.12.3](https://github.com/Endebert/squadmc/compare/v2.12.2...v2.12.3) (2020-02-24)


### Bug Fixes

* fixed pins in target selection missing + state handling ([a52214f](https://github.com/Endebert/squadmc/commit/a52214f))



<a name="2.12.2"></a>
## [2.12.2](https://github.com/Endebert/squadmc/compare/v2.12.1...v2.12.2) (2020-01-18)


### Bug Fixes

* updated PostScriptum mortar ranges ([6c5fa85](https://github.com/Endebert/squadmc/commit/6c5fa85))



<a name="2.12.1"></a>
## [2.12.1](https://github.com/Endebert/squadmc/compare/v2.12.0...v2.12.1) (2020-01-11)


### Bug Fixes

* updated PostScriptum mortar ranges ([923cb42](https://github.com/Endebert/squadmc/commit/923cb42))



<a name="2.12.0"></a>
# [2.12.0](https://github.com/Endebert/squadmc/compare/v2.11.0...v2.12.0) (2019-01-19)


### Features

* add 6cm mortar option for PS US airborne faction ([#38](https://github.com/Endebert/squadmc/issues/38)) (by TopMak) ([9913354](https://github.com/Endebert/squadmc/commit/9913354))



<a name="2.11.0"></a>
# [2.11.0](https://github.com/Endebert/squadmc/compare/v2.10.1...v2.11.0) (2018-10-17)


### Bug Fixes

* fixed changelog-dialog close button position ([29d0cce](https://github.com/Endebert/squadmc/commit/29d0cce))
* fixed FOB markers not being removed when trying to remove them in the navbar ([#34](https://github.com/Endebert/squadmc/issues/34)) (by TopMak) ([6251785](https://github.com/Endebert/squadmc/commit/6251785))
* fixed not catching an error when drawing on the map canvas ([c578791](https://github.com/Endebert/squadmc/commit/c578791))


### Features

* added error reporting functionality ([872e431](https://github.com/Endebert/squadmc/commit/872e431))
* added showing changelog dialog when using newer version for the first time ([92b7a14](https://github.com/Endebert/squadmc/commit/92b7a14))
* Improved Caching ([#33](https://github.com/Endebert/squadmc/issues/33)) (by Trikolon) ([0a06a56](https://github.com/Endebert/squadmc/commit/0a06a56))



<a name="2.10.1"></a>
## [2.10.1](https://github.com/Endebert/squadmc/compare/v2.10.0...v2.10.1) (2018-09-30)


### Bug Fixes

* fixed using non-letter keypad characters after Z (by TopMak) ([73f93aa](https://github.com/Endebert/squadmc/commit/73f93aa))



<a name="2.10.0"></a>
# [2.10.0](https://github.com/Endebert/squadmc/compare/v2.9.0...v2.10.0) (2018-09-28)


### Bug Fixes

* fixed errors & strange behaviour when deleting a target from map while using LINE/AREA fire mode ([69c92ab](https://github.com/Endebert/squadmc/commit/69c92ab))


### Features

* use modern flag to build production files (by Trikolon) ([#30](https://github.com/Endebert/squadmc/issues/30)) ([70842c4](https://github.com/Endebert/squadmc/commit/70842c4))
* Vuetify a la carte, to further reduce app size (by Trikolon) ([43a6f52](https://github.com/Endebert/squadmc/commit/43a6f52))



<a name="2.9.0"></a>
# [2.9.0](https://github.com/Endebert/squadmc/compare/v2.8.0...v2.9.0) (2018-09-22)


### Bug Fixes

* fixed layout issue in navbar title ([dfdd7f3](https://github.com/Endebert/squadmc/commit/dfdd7f3))
* replaced font "Roboto Mono" with "Hack" for better monospace & unicode text/symbols ([5868abb](https://github.com/Endebert/squadmc/commit/5868abb))


### Features

* added app name & version to splash/loading screen ([778e529](https://github.com/Endebert/squadmc/commit/778e529))
* LINE & AREA fire; by Kalliser ([6f01033](https://github.com/Endebert/squadmc/commit/6f01033))
* performance improvements through canvas rendering ([149bb9d](https://github.com/Endebert/squadmc/commit/149bb9d))



<a name="2.8.0"></a>
# [2.8.0](https://github.com/Endebert/squadmc/compare/v2.7.1...v2.8.0) (2018-08-09)


### Bug Fixes

* added "Close" button to changelog dialog ([ae09ef6](https://github.com/Endebert/squadmc/commit/ae09ef6))
* added hint to icon buttons in add mortar/target dialog ([c85de1d](https://github.com/Endebert/squadmc/commit/c85de1d))
* added polyfill for CustomEvent ([b83266c](https://github.com/Endebert/squadmc/commit/b83266c))
* adjusted PostScriptum GER 8CM mortar velocity and resulting max distance ([20dcf76](https://github.com/Endebert/squadmc/commit/20dcf76))
* allow navigation drawer to be swiped out, but not in ([99cf255](https://github.com/Endebert/squadmc/commit/99cf255))
* changed floating action button color ([e8cdd39](https://github.com/Endebert/squadmc/commit/e8cdd39))
* fixed "+" icon not being centered in floating action button ([8b539f2](https://github.com/Endebert/squadmc/commit/8b539f2))
* fixed map not being centered properly on initial page load ([87b36a4](https://github.com/Endebert/squadmc/commit/87b36a4))
* fixed menu button not being perfectly circular ([5482b1d](https://github.com/Endebert/squadmc/commit/5482b1d))
* fixed needing to reset map when switching off Advanced Mode ([445bc62](https://github.com/Endebert/squadmc/commit/445bc62))
* fixed top-left mortar/target buttons in Quick Mode ([432930e](https://github.com/Endebert/squadmc/commit/432930e))
* set max-width for changelog dialog ([ef728cd](https://github.com/Endebert/squadmc/commit/ef728cd))
* updated mortar velocities ([df76862](https://github.com/Endebert/squadmc/commit/df76862))


### Features

* added "Advanced Mode" by inverting "Quick Mode" ([bff3d38](https://github.com/Endebert/squadmc/commit/bff3d38))
* allow hiding loading indicator in toolbar (now hidden by default) ([f1e0a6f](https://github.com/Endebert/squadmc/commit/f1e0a6f))
* rearranged options in navigation drawer ([d42365a](https://github.com/Endebert/squadmc/commit/d42365a))



<a name="2.7.2"></a>
## [2.7.2](https://github.com/Endebert/squadmc/compare/v2.7.1...v2.7.2) (2018-07-18)


### Bug Fixes

* added "Close" button to changelog dialog ([ae09ef6](https://github.com/Endebert/squadmc/commit/ae09ef6))
* added polyfill for CustomEvent ([b83266c](https://github.com/Endebert/squadmc/commit/b83266c))
* adjusted PostScriptum GER 8CM mortar velocity and resulting max distance ([20dcf76](https://github.com/Endebert/squadmc/commit/20dcf76))
* set max-width for changelog dialog ([ef728cd](https://github.com/Endebert/squadmc/commit/ef728cd))



<a name="2.7.1"></a>
## [2.7.1](https://github.com/Endebert/squadmc/compare/v2.7.0...v2.7.1) (2018-07-06)


### Bug Fixes

* fixed bottom left keypad indicator not disappearing after 1 second on desktop ([4b25739](https://github.com/Endebert/squadmc/commit/4b25739))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/Endebert/squadmc/compare/v2.6.0...v2.7.0) (2018-07-06)


### Bug Fixes

* fixed version button being clipped in PostScriptum mode ([f980e8e](https://github.com/Endebert/squadmc/commit/f980e8e))


### Features

* merged PostScriptum extensions into main branch for easier maintenance ([30988bc](https://github.com/Endebert/squadmc/commit/30988bc))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/Endebert/squadmc/compare/v2.5.0...v2.6.0) (2018-07-04)


### Bug Fixes

* added css fix for compatibility with mobile safari 8 ([9caded1](https://github.com/Endebert/squadmc/commit/9caded1))
* added performance-polyfill to prevent exception thrown by Vuetify ([7087ed7](https://github.com/Endebert/squadmc/commit/7087ed7))
* fixed incorrect keypad to latlng conversion ([6828d45](https://github.com/Endebert/squadmc/commit/6828d45))


### Features

* added pin placement by keypad input dialog (bottom right button) ([61aefcc](https://github.com/Endebert/squadmc/commit/61aefcc))



<a name="2.5.0"></a>
# 2.5.0 (2018-07-02)
Reset repository, since cloning it required download of >800mb. This gets rid of old versions containing map files.
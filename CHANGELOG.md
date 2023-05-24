# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.4.2](https://github.com/wayfu-id/wayfu-userscript/compare/v4.4.1...v4.4.2) (2023-05-24)


### Bug Fixes

* **app:** wrong query on link element & err modal ([053bbe4](https://github.com/wayfu-id/wayfu-userscript/commit/053bbe41cdafd7b7c4769fbe0172f10a500fc80e))

### [4.4.1](https://github.com/wayfu-id/wayfu-userscript/compare/v4.4.0...v4.4.1) (2023-05-23)


### Bug Fixes

* **view:** fix panel menu view on dark mode ([e0118cb](https://github.com/wayfu-id/wayfu-userscript/commit/e0118cb17745143f1e693cbea88ae2536f642099))

## [4.4.0](https://github.com/wayfu-id/wayfu-userscript/compare/v4.3.3...v4.4.0) (2023-02-02)


### Features

* **report:** New report model, add download button on success report ([f5ad44b](https://github.com/wayfu-id/wayfu-userscript/commit/f5ad44b9d80bab9a98338aaa72214115c9e5aa8c))
* **xlsx:** Add feature to create xlsx file using arrayType data ([9f3471f](https://github.com/wayfu-id/wayfu-userscript/commit/9f3471f7f2f8178c116569d07b42dd38aa825dfa))
* **xlsx:** Add option to set filetype upon exporting file ([6245cc7](https://github.com/wayfu-id/wayfu-userscript/commit/6245cc7be3f30f5123c0d3a3856b1c320324474e))
* **xlsx:** Implement export as xlsx on downloading group contacts ([3413e57](https://github.com/wayfu-id/wayfu-userscript/commit/3413e5702833133f2e12b8c00e60341cc20e5aeb))
* **xlsx:** Implement export file as csv or xlsx filetype ([c09d195](https://github.com/wayfu-id/wayfu-userscript/commit/c09d1958ebbe7a412e858356a393cf9c39cf0be8))
* **xlsx:** Implement Xlsx lib to create xlsx file ([0e11866](https://github.com/wayfu-id/wayfu-userscript/commit/0e118664b10a8f03262fdab4bb0756960aa83cdf))


### Bug Fixes

* **csv:** Allow empty cell value data on csv filetype ([d2cd6b1](https://github.com/wayfu-id/wayfu-userscript/commit/d2cd6b1cc06ac43add67704c20b8b82014db082c))
* **message:** Fix parsing message when there is a datestring on it ([922ad5a](https://github.com/wayfu-id/wayfu-userscript/commit/922ad5ad3b1825a6d7419e81d1c111362564da4e))
* **report:** Fix wrong detection upon fail and error process ([b79b6ea](https://github.com/wayfu-id/wayfu-userscript/commit/b79b6ead8cc7da7ca315dd30fbc983eaf6e6beae))
* **report:** fix wrong reading fail and error status ([9fb7c98](https://github.com/wayfu-id/wayfu-userscript/commit/9fb7c98c605fb965dd530f6470a26d1ecac571cd))
* **svg:** Fix svg factory and add some html form element factory ([c1bad57](https://github.com/wayfu-id/wayfu-userscript/commit/c1bad575dabd97e37c5620dd00ab4613e25a46b3))

### [4.3.3](https://github.com/wayfu-id/wayfu-userscript/compare/v4.3.2...v4.3.3) (2022-11-22)


### Bug Fixes

* **xlsx:** Fix error while reading Date type value, format it to string type ([547db72](https://github.com/wayfu-id/wayfu-userscript/commit/547db725830901191aae4d3e7cc2969306bc3cf7))
* **xlsx:** Fix xlsx file checking RegExp also remove csv checking RegExp ([4da3048](https://github.com/wayfu-id/wayfu-userscript/commit/4da3048f79729e39223d6e59a4f125ec0c334535))
* **xlsx:** Improve file checking on import function ([078fc93](https://github.com/wayfu-id/wayfu-userscript/commit/078fc936bec0f70ded11c7276bda64bde040a6ec))
* **xlsx:** Try get file data before load it to queue ([8c2da45](https://github.com/wayfu-id/wayfu-userscript/commit/8c2da4519e8795a84ee1474516142882293662b7))

### [4.3.2](https://github.com/wayfu-id/wayfu-userscript/compare/v4.3.1...v4.3.2) (2022-11-11)


### Bug Fixes

* **chat:** Bugfix unsycronized active chatroom data ([a7ac5fb](https://github.com/wayfu-id/wayfu-userscript/commit/a7ac5fb969d805916dddecfe4eab55c60a3bc6fe))

### [4.3.1](https://github.com/wayfu-id/wayfu-userscript/compare/v4.3.0...v4.3.1) (2022-11-05)


### Bug Fixes

* **data:** Fixing wrong checking input file type ([382f362](https://github.com/wayfu-id/wayfu-userscript/commit/382f362a682121a196a9d8c3a5daf80f1249d4fb))

## [4.3.0](https://github.com/wayfu-id/wayfu-userscript/compare/v4.2.2...v4.3.0) (2022-11-04)


### Features

* **data:** Add Xlsx openxml spreadsheetml documet reader ([8b5ea05](https://github.com/wayfu-id/wayfu-userscript/commit/8b5ea0596107e0c8c9cafb4508f532a8f51a1e90))
* **data:** Implement xlsx file reader ([ca27f33](https://github.com/wayfu-id/wayfu-userscript/commit/ca27f330cb1e61ff0ea6194988a8589f93a872f2))


### Bug Fixes

* **chat:** Fix error on reading current active chatroom data ([52deb45](https://github.com/wayfu-id/wayfu-userscript/commit/52deb45cf74a3995afe11f6dde6dda88feb8eb16))
* **typo:** Fix duplicate extension file on name when export data from reports ([c4513fd](https://github.com/wayfu-id/wayfu-userscript/commit/c4513fd07df71498b3421422cad75a0094484b4d))
* **typo:** Fix typo on variable name ([8174f4f](https://github.com/wayfu-id/wayfu-userscript/commit/8174f4ffa4f181a3b92e2877f362ef8fa50327aa))

### [4.2.2](https://github.com/wayfu-id/wayfu-userscript/compare/v4.2.1...v4.2.2) (2022-09-25)


### Bug Fixes

* **csv:** fix issue [#21](https://github.com/wayfu-id/wayfu-userscript/issues/21) - edit phone regexp(s) and implement it ([4019ad9](https://github.com/wayfu-id/wayfu-userscript/commit/4019ad98956759037dc84541395377c984d35128))

### [4.2.1](https://github.com/wayfu-id/wayfu-userscript/compare/v4.2.0...v4.2.1) (2022-07-25)


### Bug Fixes

* text preview bugs on multiple new line ([cd9a8ce](https://github.com/wayfu-id/wayfu-userscript/commit/cd9a8ce7fc0497431241e6996c236af6d7d2ddc5))

## [4.2.0](https://github.com/wayfu-id/wayfu-userscript/compare/v4.1.1...v4.2.0) (2022-07-19)


### Features

* add drawdown implementation ([5f939c8](https://github.com/wayfu-id/wayfu-userscript/commit/5f939c8c1071d08fd8efe398c52444f6c6948c97))
* add drawdown to decode whatsapp markdown format from user input ([b9bf462](https://github.com/wayfu-id/wayfu-userscript/commit/b9bf462594f2897f79984be976f4d31b395cd6c7))
* add new and remove some event listener ([c041714](https://github.com/wayfu-id/wayfu-userscript/commit/c041714ec56177681012d34bf31942b14eb1de9c))
* **views:** add message or caption preview ([48c2291](https://github.com/wayfu-id/wayfu-userscript/commit/48c2291a4e3ea4987d577256f7457158c6cd07e6))

### [4.1.1](https://github.com/wayfu-id/wayfu-userscript/compare/v4.1.0...v4.1.1) (2022-06-17)


### Bug Fixes

* cannot detected groupchat when not clicked from side pannel ([aec01f6](https://github.com/wayfu-id/wayfu-userscript/commit/aec01f67b5714b7679d28746cf002ab85c4c3bdc))

## [4.1.0](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.10...v4.1.0) (2022-06-16)


### Features

* add new premium feature to access and download group participats ([c7d0446](https://github.com/wayfu-id/wayfu-userscript/commit/c7d044659461f1e6f06cbea6289f178fe2cf1929))


### Bug Fixes

* no message for non premium users [#17](https://github.com/wayfu-id/wayfu-userscript/issues/17) ([dd07491](https://github.com/wayfu-id/wayfu-userscript/commit/dd0749136c8eabfee8ae8725c1943b5ccb0e9c28))

### [4.0.10](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.9...v4.0.10) (2022-06-07)


### Bug Fixes

* send image doesn't work [#15](https://github.com/wayfu-id/wayfu-userscript/issues/15) ([aec7b5d](https://github.com/wayfu-id/wayfu-userscript/commit/aec7b5df8832544860b5d1acfaf93d8f844bdfcf))

### [4.0.9](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.8...v4.0.9) (2022-06-07)


### Bug Fixes

* wapi contact models not found [#13](https://github.com/wayfu-id/wayfu-userscript/issues/13) ([3357f2b](https://github.com/wayfu-id/wayfu-userscript/commit/3357f2b81cda07ad88701010cc22adfa228efea0))

### [4.0.8](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.7...v4.0.8) (2022-06-02)


### Bug Fixes

* report filename extension missing on some devices [#11](https://github.com/wayfu-id/wayfu-userscript/issues/11) ([dddb1d0](https://github.com/wayfu-id/wayfu-userscript/commit/dddb1d08cf5b3503a4f0c32995f2e329a835d2d1))

### [4.0.7](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.6...v4.0.7) (2022-05-27)


### Bug Fixes

* data reader validator [#9](https://github.com/wayfu-id/wayfu-userscript/issues/9) ([5ec0300](https://github.com/wayfu-id/wayfu-userscript/commit/5ec03008c033adbcd65aed1d8ec2dc31058f7f8e))

### [4.0.6](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.5...v4.0.6) (2022-05-16)


### Bug Fixes

* error on checking update [#7](https://github.com/wayfu-id/wayfu-userscript/issues/7) ([c8b6ff4](https://github.com/wayfu-id/wayfu-userscript/commit/c8b6ff43a3084a4a1f8fccb154be128195d3abf8))

### [4.0.5](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.4...v4.0.5) (2022-05-16)


### Bug Fixes

* annoying nasted report filename(s) [#1](https://github.com/wayfu-id/wayfu-userscript/issues/1) ([d47f896](https://github.com/wayfu-id/wayfu-userscript/commit/d47f896efd9da96df4f7c5b88fa363cadc78f7b6))
* blast icon doesn/'t change [#5](https://github.com/wayfu-id/wayfu-userscript/issues/5) ([86266ca](https://github.com/wayfu-id/wayfu-userscript/commit/86266ca06c9a8926757621b9617b6e7149141bf6))
* blast icon not working again [#5](https://github.com/wayfu-id/wayfu-userscript/issues/5) ([3b105dc](https://github.com/wayfu-id/wayfu-userscript/commit/3b105dc06cc6673110a71751ba5178de062a8eaa))

### [4.0.4](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.3...v4.0.4) (2022-04-17)


### Bug Fixes

* **message:** sponsor name failed to be printed ([d01b42e](https://github.com/wayfu-id/wayfu-userscript/commit/d01b42e04a2f4d49cfc74fd45c71a041f8484b54))

### [4.0.3](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.2...v4.0.3) (2022-04-16)


### Bug Fixes

* **user:** expiress date doesn\'t update ([88cf519](https://github.com/wayfu-id/wayfu-userscript/commit/88cf519a23c67b8c25a792846c59042132b6a945))

### [4.0.2](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.1...v4.0.2) (2022-04-14)


### Bug Fixes

* **view:** download button on report doesn\'t appear ([2a5fd8f](https://github.com/wayfu-id/wayfu-userscript/commit/2a5fd8f5a9e2149947f0ef85862c0521b997f8e8))
* **view:** download button on report doesn\'t appear ([4de3dde](https://github.com/wayfu-id/wayfu-userscript/commit/4de3ddeb20492938241564bbf68e6fbaf2e9ba00))

### [4.0.1](https://github.com/wayfu-id/wayfu-userscript/compare/v4.0.0...v4.0.1) (2022-04-12)


### Bug Fixes

* **user:** add parsevalue function in utility ([151d551](https://github.com/wayfu-id/wayfu-userscript/commit/151d551599ca7b17a09b94d46bcaa0b815e392f4))
* **user:** change object parsing function ([c08a7b0](https://github.com/wayfu-id/wayfu-userscript/commit/c08a7b0ddbf608155c0810859ffcac3871b93fca))
* **user:** failed init user when no local data found ([7cdaefa](https://github.com/wayfu-id/wayfu-userscript/commit/7cdaefa4969e3c28630bcf64c592f1096c107fdd))

## 4.0.0 (2022-04-11)


### ⚠ BREAKING CHANGES

* **scripts:** All HTML id and classes are different
- So new script will not be able to use previous view
* **views:** All HTML id and classes are different
- Previous apps will not be able use new views

### Features

* add array item checker function ([93e2eee](https://github.com/wayfu-id/wayfu-userscript/commit/93e2eee4fa390a3babdd3ab8dd499ba53948e677))
* add confirmation when stop process ([70e8867](https://github.com/wayfu-id/wayfu-userscript/commit/70e8867740f196b9cb32f3cc0ccfef1a729437b6))
* add jsonparse validator ([377d5cc](https://github.com/wayfu-id/wayfu-userscript/commit/377d5ccd019a8b14435f67e6b2f7196b823ebe79))
* store csv filename ([b2b7b08](https://github.com/wayfu-id/wayfu-userscript/commit/b2b7b08bbe749e281c18c9f57b21ab1a5bc34e74))


### Bug Fixes

* **build:** insert userscript header on build ([63274cd](https://github.com/wayfu-id/wayfu-userscript/commit/63274cde70a96591aae5470efe4488c7143288de))
* gm_getvalue not return base value ([672295f](https://github.com/wayfu-id/wayfu-userscript/commit/672295f0066a7fed1b1ff6c7458fbd259b38664d))
* local user data seems doesn't load ([872a187](https://github.com/wayfu-id/wayfu-userscript/commit/872a1875b446869ea76ee6f8ef9250eb1d95ec85))
* move callback to outside, so it always call if setted ([c91366b](https://github.com/wayfu-id/wayfu-userscript/commit/c91366b9a87452380866d1df9882bb1e246ddd16))
* phone not display on progress pane ([92525ce](https://github.com/wayfu-id/wayfu-userscript/commit/92525ce84dd2d28450977f41de5b06bd28052041))
* remove whitespace in empty textarea ([c77b197](https://github.com/wayfu-id/wayfu-userscript/commit/c77b197053493e1d958eb711daec878fcbf77d09))


* **scripts:** refactoring all previous scripts ([3b37062](https://github.com/wayfu-id/wayfu-userscript/commit/3b37062a44e21d214cc09c554c15d9282583223a))
* **views:** refactor html, css, and other assets ([979ca7c](https://github.com/wayfu-id/wayfu-userscript/commit/979ca7c7eb1dd6579af92ec3dc8e92208ebace0a))
